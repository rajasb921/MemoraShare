const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 8383
const data = require('./sample-data')

app.use(cors())
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.json(data)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))