const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const attendanceRoutes = require('./routes/attendance');
const imageRoutes = require('./routes/image')
const mamRoutes = require('./routes/mam')
const cors = require('cors');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT|| 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/image', imageRoutes );
app.use('/api/mam', mamRoutes )




const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  sequelize.sync({ alter: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Error syncing database:', err);
  });
  
