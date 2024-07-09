const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MamSchool = sequelize.define('mam_school_at_api_table', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      API_User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Upload_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Matched_User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Image_filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Image_storage_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      match_outcome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
    });

module.exports = MamSchool;
