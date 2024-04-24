const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const { fetchDataFromDatabase } = require('./middleware/getMiddleware');

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express()
const port = 8383

const { Pool } = require('pg');  // Connect to local Postgres DB

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

pool.connect()

app.use(cors())
app.use(bodyParser.json());
app.use("/uploads", express.static('uploads'))

// Define a route to fetch data from the database
app.get('/', async (req, res) => {
  let users = []
  pool.query('Select * from users', (err, respost) => {
    if(!err){
      res.json(respost.rows)
    }
  })
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Regular expression patterns for alphabets and numbers only
  const alphanumericPattern = /^[a-zA-Z0-9]+$/;

  // Check if username and password match the pattern
  if (!alphanumericPattern.test(username) || !alphanumericPattern.test(password)) {
    return res.status(400).send('Username and password must contain only alphabets or numbers.');
  }

  pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
    

    // If no user found with the provided username and password
    if (result.rows.length === 0) {
      return res.status(401).send('Incorrect username or password');
    }
    const user = result.rows[0];
    // Send the user's email as response
    return res.status(200).json({ userID: user.userid });
  });
 
})

app.post('/signup', async (req, res) => {
  const { firstname, lastname, username, password, email } = req.body;
  pool.query('SELECT * FROM users WHERE username = $1 or email = $2', [username, email], (err, result) => {

    // If no user found with the provided username and password
    if (result.rows.length > 0) {
      return res.status(401).send('Username or email already exists');
    }
    pool.query('INSERT INTO users (firstname, lastname, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING userid', [firstname, lastname, username, password, email], (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      const userID = result.rows[0].userid;
      const freeInsertQuery = 'INSERT INTO free_users (userid, count) VALUES ($1, $2)';
      const freeInsertValues = [userID, 0];
      pool.query(freeInsertQuery, freeInsertValues, (err, result) => {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.json({ userID: userID });
      })
    })
  });
})

app.post('/addevent', upload.array('images', 5), async (req, res) => {
  const { date, userID, name, description, numusers, usernames } = req.body; // Add usernames field here

  const eventInsertQuery = 'INSERT INTO events (date, name, description, numusers, userID) VALUES ($1, $2, $3, $4, $5) RETURNING eventid;';
  const eventInsertValues = [date, name, description, numusers, userID];

  try {
    // Execute the event insertion query
    const eventResult = await pool.query(eventInsertQuery, eventInsertValues);
   
    const eventId = eventResult.rows[0].eventid;
    console.log('Inserted event with ID:', eventId);

    // Split the usernames string into individual usernames
    const usernamesArray = usernames.split(',');
    usernamesArray.forEach(username =>username.trim());
    
    const collabInsertQuery = `INSERT INTO collab (eventid, userid) VALUES ($1, $2)`;
    await pool.query(collabInsertQuery, [eventId, userID]);
    // Iterate over the usernames list
   
    if (usernamesArray[0] !== ''){
      for (const username of usernamesArray) {
        // Execute query to get userID for the current username
        console.log(username)
        const userQuery = `SELECT userid FROM users WHERE username = TRIM($1)`;
        const userResult = await pool.query(userQuery, [username]);
        
        // Extract userID from the query result
        const userId = userResult.rows[0].userid;
  
        // Construct and execute the SQL query to insert eventid and userid into collab table
        const collabInsertQuery = `INSERT INTO collab (eventid, userid) VALUES ($1, $2)`;
        const collabInsertValues = [eventId, userId];
        await pool.query(collabInsertQuery, collabInsertValues);
      }
    }

    // Insert images into the database
    for (const file of req.files) {
      // Extract necessary data from file object
      const { originalname, path } = file;

      await new Promise((resolve, reject) => {
        pool.query('INSERT INTO content (file_path, filename, eventid) VALUES ($1, $2, $3);', [path, originalname, eventId], (err, result) => {
          if (err) {
            console.error('Error inserting file into content:', err);
            reject(err);
          } else {
            console.log('File inserted into content');
            resolve();
          }
        });
      });
    }

    // Send a success response
    res.json({message:'Event added successfully!'});
  } catch (error) {
    console.error('Error adding event:', error);
    if (error === "User already has 3 events"){
      res.status(501).json({message:'Cannot insert more than 3'});
    }
    res.status(500).json({message:'Internal Server Error'});
  }
});


// app.post('/addevent', upload.array('images', 5), async (req, res) => {
//   const {date, userID, name, description, numusers} = req.body

//   const eventInsertQuery = 'INSERT INTO events (date, name, description, numusers, userID) VALUES ($1, $2, $3, $4, $5) RETURNING eventid';
//   const eventInsertValues = [date, name, description, numusers, userID];
  
//   pool.query(eventInsertQuery, eventInsertValues, async (err, result) => {
    
//     const eventId = result.rows[0].eventid;
//     console.log('Inserted event with ID:', eventId);

//     try {
//       for (const file of req.files) {
//         // Extract necessary data from file object
//         const { originalname, path } = file;
  
//         await new Promise((resolve, reject) => {
//           pool.query('INSERT INTO content (file_path, filename, eventid) VALUES ($1, $2, $3)', [path, originalname, eventId], (err, result) => {
//             if (err) {
//               console.error('Error inserting file into content:', err);
//               reject(err);
//             } else {
//               console.log('File inserted into content');
//               resolve();
//             }
//           });
//         });
//       }
//     } catch (error) {
//       res.status(500).send('Internal Server Error');
//     }
//   });
//   res.status(200).send('Upload successful');
// })

app.post('/user-events-images', async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch events for the given user
    const userEvents = await pool.query('SELECT * FROM events WHERE eventid IN (SELECT eventid FROM collab WHERE userid = $1)', [userId]);
   
    // Initialize an array to store image paths
    const eventAndCollabs = []
    // Iterate through each event and fetch corresponding images
    for (const event of userEvents.rows) {
      const collabedUsernamesQuery = await pool.query('select username, u.userid from collab c join users u on u.userid = c.userid where c.eventid = $1', [event.eventid]);
      const eventDetailsQuery = await pool.query('SELECT name, date, description FROM content c JOIN events e ON c.eventid = e.eventid WHERE c.eventid = $1', [event.eventid]);
      const eventImagesQuery = await pool.query('SELECT file_path FROM content c JOIN events e ON c.eventid = e.eventid WHERE c.eventid = $1', [event.eventid]);
      eventAndCollabs.push({
        collabUsernames: [...collabedUsernamesQuery.rows],
        eventDetails: [...eventDetailsQuery.rows],
        eventImages: [...eventImagesQuery.rows]
      })
    }

    // Respond with the array of image paths
    res.json({ events: eventAndCollabs});
  } catch (error) {
    console.error('Error fetching user event images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
// app.post('/user-events-images', async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Fetch events for the given user
//     const userEvents = await pool.query('SELECT * FROM events WHERE userid = $1', [userId]);
   
//     // Initialize an array to store image paths
//     const eventImages = [];

//     // Iterate through each event and fetch corresponding images
//     for (const event of userEvents.rows) {
//       const eventImagesQuery = await pool.query('SELECT file_path FROM content WHERE eventid = $1', [event.eventid]);
      
//       if (eventImagesQuery.rows.length !== 0){
//         const imageURLs = eventImagesQuery.rows.map(image => `${req.protocol}://${req.get('host')}/${image.file_path}`);
//         eventImages.push(imageURLs);
//       }
//     }

//     // Respond with the array of image paths
//     res.json({ images: eventImages });
//   } catch (error) {
//     console.error('Error fetching user event images:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/searchUsers', async (req, res) => {
  // Query to search for users based on the search query
  pool.query('SELECT username, userid FROM users', (err, result) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.json({ username: result.rows }); // Sending the usernames found in the database
  });
})


app.listen(port, () => console.log(`Server has started on port: ${port}`))