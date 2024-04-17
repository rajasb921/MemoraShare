const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const { fetchDataFromDatabase } = require('./middleware/getMiddleware');

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
  console.log(req.body)
  pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
    console.log(result)

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
    pool.query('INSERT INTO users (firstname, lastname, username, password, email) VALUES ($1, $2, $3, $4, $5)', [firstname, lastname, username, password, email], (err, result) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
  
      pool.query('SELECT userid FROM USERS WHERE username = $1', [username], (err, result) => {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.json({ userID: result.rows[0].userid })
        
      })
  
    })

  });

})


app.listen(port, () => console.log(`Server has started on port: ${port}`))