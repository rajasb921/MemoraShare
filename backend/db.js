const { Pool } = require('pg');  // Connect to local Postgres DB

const pool = new Pool({
  user: 'rajas',
  host: 'localhost',
  database: 'rajas',
  password: '12345',
  port: 5432,
})

module.exports = pool;