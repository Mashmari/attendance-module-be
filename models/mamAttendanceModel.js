const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MamSchool = require('./mamSchoolModel');

const MamAttendance = sequelize.define('mam_attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true
  },
  API_User_ID: {
    type: DataTypes.STRING(200),
    primaryKey: false,
    allowNull: false,
  },
      Upload_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
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
      Status_Pending: {//Today changes
        type: DataTypes.STRING,
        allowNull: false,
        // defaultValue: "Yes",
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
    MamAttendance.belongsTo(MamSchool, {
      foreignKey: 'API_User_ID',
      targetKey: 'API_User_ID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
module.exports = MamAttendance;
