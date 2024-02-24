const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const pool = require('./db');
const { fetchDataFromDatabase } = require('./middleware/getMiddleware');

const app = express()
const port = 8383
//const data = require('./sample-data')

app.use(cors())
app.use(bodyParser.json());

// Define a route to fetch data from the database
app.get('/', fetchDataFromDatabase, (req, res) => {
  res.json(req.eventData);
});

app.listen(port, () => console.log(`Server has started on port: ${port}`))