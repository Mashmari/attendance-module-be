const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

// Database connection
const pool = mysql.createPool(dbConfig);

// MamSchool Model
const MamSchool = {
  // Get a school by API_User_ID
  async findByApiUserId(API_User_ID) {
    const [rows] = await pool.query('SELECT * FROM mam_school WHERE API_User_ID = ?', [API_User_ID]);
    return rows[0];
  },

  // Create a new school record
  async create(schoolData) {
    const {
      School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID
    } = schoolData;

    const query = `
      INSERT INTO mam_school (
        School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID
    ]);

    return result.insertId;
  },

  // Update a school record by API_User_ID
  async updateByApiUserId(API_User_ID, updatedData) {
    const {
      School_ID, School_Name, Class_ID, Class_Name, Location_ID
    } = updatedData;

    const query = `
      UPDATE mam_school SET
        School_ID = ?, School_Name = ?, Class_ID = ?, Class_Name = ?, Location_ID = ?
      WHERE API_User_ID = ?
    `;

    const [result] = await pool.execute(query, [
      School_ID, School_Name, Class_ID, Class_Name, Location_ID, API_User_ID
    ]);

    return result.affectedRows;
  },

  // Delete a school record by API_User_ID
  async deleteByApiUserId(API_User_ID) {
    const query = 'DELETE FROM mam_school WHERE API_User_ID = ?';
    const [result] = await pool.execute(query, [API_User_ID]);

    return result.affectedRows;
  },

  // Get all school records with optional pagination
  async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM mam_school
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [limit, offset]);

    return rows;
  }
};

module.exports = MamSchool;
