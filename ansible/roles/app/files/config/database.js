require('dotenv').config();
const { Sequelize } = require('sequelize');

// Use environment variables from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // optional: disable SQL query logs in console
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ Unable to connect:', err));

module.exports = sequelize;

