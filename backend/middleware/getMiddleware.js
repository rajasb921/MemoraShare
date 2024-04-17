// Define a middleware function to fetch data from the database
const pool = require('../db');
const fetchDataFromDatabase = async (req, res, next) => {
  try {
    // Query to select data from the events table
    const query = 'SELECT * FROM events ORDER BY date';
    const { rows } = await pool.query(query);

    // Attach the retrieved data to the request object
    req.eventData = rows;
    next(); // Call the next middleware function
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {fetchDataFromDatabase};