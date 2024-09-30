// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();
// const path = require('path');
// const mysql = require('mysql2/promise');
// // const attendanceRoutes = require('./routes/attendance');
// const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
// const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
// const matchRoutes = require('./routes/match');
// const mamschooldataRoutes = require('./routes/mamschooldata');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Routes
// // app.use('/api/attendance', attendanceRoutes);
// app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
// app.use('/mam', mamAttendanceRoutes);
// app.use('/api', matchRoutes);
// app.use('/api/mamschool', mamschooldataRoutes);
// app.get('/image', async (req, res) => {
//   try {
//     const imagePath = req.query.path;
//     console.log(imagePath);
//     res.sendFile(path.resolve(imagePath));
//   } catch (error) {
//     console.log("loading image...");
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Test database connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.query('SELECT 1');
//     connection.release();
//     console.log('Database connection has been established successfully.');
//   } catch (err) {
//     console.error('Unable to connect to the database:', err);
//   }
// })();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();
// const path = require('path');
// const mysql = require('mysql2/promise');
// const AWS = require('aws-sdk'); // Add AWS SDK
// const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
// const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
// const matchRoutes = require('./routes/match');
// const mamschooldataRoutes = require('./routes/mamschooldata');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// // Configure AWS SDK
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3(); // Initialize S3 instance

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Routes
// app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
// app.use('/mam', mamAttendanceRoutes);
// app.use('/api', matchRoutes);
// app.use('/api/mamschool', mamschooldataRoutes);

// // Serve images
// app.get('/image', async (req, res) => {
//   try {
//     const imagePath = req.query.path;
//     console.log(imagePath);
//     res.sendFile(path.resolve(imagePath));
//   } catch (error) {
//     console.log('loading image...');
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Function to create folders in S3
// const createFoldersInS3 = async (locationId) => {
//   const bucketName = process.env.AWS_S3_BUCKET_NAME;
//   const faceRecognizedFolder = `${locationId}/face_recognized/`;
//   const capturedImageFolder = `${locationId}/captured_image/`;

//   const createFolder = async (folderPath) => {
//     const params = {
//       Bucket: bucketName,
//       Key: folderPath, // folder path
//       Body: '', // empty content
//     };
//     return s3.putObject(params).promise();
//   };

//   try {
//     // Create both folders
//     await createFolder(faceRecognizedFolder);
//     await createFolder(capturedImageFolder);
//     console.log(`Folders created successfully for location: ${locationId}`);
//   } catch (error) {
//     console.error('Error creating folders in S3:', error);
//     throw error;
//   }
// };

// // Example API route to insert data and create folders in S3
// app.post('/api/mamschool/create', async (req, res) => {
//   const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

//   const insertQuery = `INSERT INTO mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID) 
//                        VALUES (?, ?, ?, ?, ?, ?)`;

//   try {
//     // Insert data into MySQL database
//     const [result] = await pool.query(insertQuery, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);

//     // Create folders in S3
//     await createFoldersInS3(Location_ID);

//     res.status(200).json({ message: 'Data inserted and folders created successfully.' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to insert data or create folders.' });
//   }
// });

// // Test database connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.query('SELECT 1');
//     connection.release();
//     console.log('Database connection has been established successfully.');
//   } catch (err) {
//     console.error('Unable to connect to the database:', err);
//   }
// })();

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql2/promise');
// const AWS = require('aws-sdk');
// require('dotenv').config();
// const path = require('path');

// // AWS S3 Configuration
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });
// const bucketName = process.env.AWS_S3_BUCKET_NAME;

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // API Routes
// const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
// const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
// const matchRoutes = require('./routes/match');
// const mamschooldataRoutes = require('./routes/mamschooldata');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');

// app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
// app.use('/mam', mamAttendanceRoutes);
// app.use('/api', matchRoutes);
// app.use('/api/mamschool', mamschooldataRoutes);

// app.get('/image', async (req, res) => {
//   try {
//     const imagePath = req.query.path;
//     res.sendFile(path.resolve(imagePath));
//   } catch (error) {
//     console.log("loading image...");
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Create a folder in S3
// const createFolderInS3 = async (folderName) => {
//   try {
//     const params = {
//       Bucket: bucketName,
//       Key: folderName, // Folder path in S3 must end with '/'
//       Body: ''  // Empty body to create a folder
//     };

//     console.log('Creating folder in S3:', folderName);
//     const data = await s3.putObject(params).promise();
//     console.log('Folder created successfully in S3:', data);
//   } catch (error) {
//     console.error('Error creating folder in S3:', error);
//   }
// };

// // API to insert data and create folders in S3
// app.post('/api/mamschool/create', async (req, res) => {
//   const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

//   const insertQuery = `
//     INSERT INTO mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   try {
//     // Insert data into MySQL
//     const connection = await pool.getConnection();
//     await connection.query(insertQuery, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);
//     connection.release();

//     // Create folders in AWS S3
//     const faceRecognizedFolder = `${Location_ID}/face_recognized/`;
//     const capturedImageFolder = `${Location_ID}/captured_image/`;

//     // Create both folders
//     await createFolderInS3(faceRecognizedFolder);
//     await createFolderInS3(capturedImageFolder);

//     res.status(200).json({ message: 'Data inserted and folders created in S3 successfully.' });
//   } catch (error) {
//     console.error('Error inserting data or creating folders:', error);
//     res.status(500).json({ error: 'Failed to insert data or create folders in S3.' });
//   }
// });

// // Test database connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.query('SELECT 1');
//     connection.release();
//     console.log('Database connection has been established successfully.');
//   } catch (err) {
//     console.error('Unable to connect to the database:', err);
//   }
// })();

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');
require('dotenv').config();
const path = require('path');

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const bucketName = process.env.S3_BUCKET_NAME;

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

// API Routes
const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
const matchRoutes = require('./routes/match');
const mamschooldataRoutes = require('./routes/mamschooldata');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Mounting API routes
app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
app.use('/mam', mamAttendanceRoutes);
app.use('/api', matchRoutes);
app.use('/api/mamschool', mamschooldataRoutes);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve image from the given path
app.get('/image', async (req, res) => {
  try {
    const imagePath = req.query.path;
    res.sendFile(path.resolve(imagePath));
  } catch (error) {
    console.error("Error loading image:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Function to create folder in AWS S3
const createFolderInS3 = async (folderName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: folderName, // S3 expects folder paths to end with '/'
      Body: ''  // Empty body to create a folder
    };

    console.log('Creating folder in S3:', folderName);
    await s3.putObject(params).promise();
    console.log(`Folder created successfully: ${folderName}`);
  } catch (error) {
    console.error(`Error creating folder ${folderName} in S3:`, error);
    throw error; // Propagate error for higher-level handling
  }
};

// API to insert school data into MySQL and create folders in AWS S3
app.post('/api/mamschool/create', async (req, res) => {
  const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

  const insertQuery = `
    INSERT INTO mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    // Insert data into MySQL
    const connection = await pool.getConnection();
    await connection.query(insertQuery, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);
    connection.release();

    // Define folder paths in S3
    const faceRepositoryFolder = `${Location_ID}/faces-repository/`;
    const capturedImagesFolder = `${Location_ID}/captured_images/`;

    // Create both folders in S3
    await createFolderInS3(faceRepositoryFolder);
    await createFolderInS3(capturedImagesFolder);

    res.status(200).json({ message: 'Data inserted and folders created in S3 successfully.' });
  } catch (error) {
    console.error('Error inserting data or creating folders:', error);
    res.status(500).json({ error: 'Failed to insert data or create folders in S3.' });
  }
});

// Test MySQL database connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');  // Simple test query
    connection.release();
    console.log('Database connection established successfully.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
