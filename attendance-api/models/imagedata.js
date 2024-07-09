const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('mam_school_image_data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      School_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Class_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Ref_Image_filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Ref_Image_filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Ref_Image_Create_DateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Ref_Image_Update_DateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Ref_Image_Update_Count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      School_Location_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StudentName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Param1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Param2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
    });

module.exports = Image;
