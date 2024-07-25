const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure to adjust the path as necessary

const MamSchool = sequelize.define('mam_school', {
    // 
    School_ID: {
        type: DataTypes.BIGINT, // Ensure this is BIGINT
        allowNull: false,
        primaryKey: false,
        validate: {
          len: [6, 6]
        }
    },
    School_Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Class_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: [10, 10]
        }
    },
    Class_Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    API_User_ID: {
        type: DataTypes.STRING(200),
        allowNull: false,
        primaryKey: true,
        unique:true,
    },
    Location_ID: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
});



module.exports = MamSchool;
