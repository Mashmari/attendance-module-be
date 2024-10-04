const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const mysql = require('mysql2/promise');
// const attendanceRoutes = require('./routes/attendance');
const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
const matchRoutes = require('./routes/match');
const mamschooldataRoutes = require('./routes/mamschooldata');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
// app.use('/api/attendance', attendanceRoutes);
app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
app.use('/mam', mamAttendanceRoutes);
app.use('/api', matchRoutes);
app.use('/api/mamschool', mamschooldataRoutes);
app.get('/image', async (req, res) => {
  try {
    const imagePath = req.query.path;
    console.log(imagePath);
    res.sendFile(path.resolve(imagePath));
  } catch (error) {
    console.log("loading image...");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('Database connection has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


