

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const attendanceRoutes = require('./routes/attendance');
const mamSchoolStudentRoutes = require('./routes/mamSchoolStudentRoutes');
const mamAttendanceRoutes = require('./routes/mamAttendanceRoutes');
const matchRoutes = require('./routes/match');
const mamschooldataRoutes = require('./routes/mamschooldata');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/mamSchoolStudent', mamSchoolStudentRoutes);
app.use('/mam', mamAttendanceRoutes);
app.use('/api', matchRoutes);
app.use('/api/mamschool', mamschooldataRoutes);
app.get('/image', async (req, res) => {
  try {
    const imagePath = req.query.path;
    console.log(imagePath);
    res.sendFile(imagePath);
  } catch (error) {
    console.log("loading image...");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const MamSchool = require('./models/mamAttendanceModel');
const MamSchoolData = require('./models/mamSchoolModel');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Error syncing database:', err);
});


