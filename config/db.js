const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_DB_URL
      : process.env.DEVELOPMENT_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };
