const Sequelize = require("sequelize");

// Initialize Sequelize with database credentials
const sequelize = new Sequelize("attendance", "root", "root421", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
