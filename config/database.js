const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root421',
  database: process.env.DB_NAME || 'attendance',
  waitForConnections: true,
  connectionLimit: 10,  // Adjust this based on your server capacity
  queueLimit: 0,        // No limit on the number of queued connection requests
  connectTimeout: 10000 // 10 seconds timeout
});

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database.');
    
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit the application if the connection fails
  }
})();

module.exports = pool;
