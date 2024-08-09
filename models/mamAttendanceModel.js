const mysql = require('mysql2/promise');
const config = require('../config/database'); // Ensure this path is correct

// Create a MySQL connection pool
const pool = mysql.createPool(config);

// Create table query
const createTableQuery = `
CREATE TABLE IF NOT EXISTS mam_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    API_User_ID VARCHAR(200) NOT NULL,
    Upload_timestamp DATETIME DEFAULT NOW(),
    Matched_User_ID INT,
    Image_filename VARCHAR(255) NOT NULL,
    Image_storage_path VARCHAR(255) NOT NULL,
    match_outcome VARCHAR(255) NOT NULL,
    Status_Pending VARCHAR(255) NOT NULL,
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL,
    FOREIGN KEY (API_User_ID) REFERENCES mam_school(API_User_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;

// Initialize the database schema
const initialize = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(createTableQuery);
    } finally {
        connection.release();
    }
};

// CRUD Operations
const create = async (data) => {
    const { API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename, Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude } = data;
    const query = `
    INSERT INTO mam_attendance (API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename, Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await pool.query(query, [API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename, Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude]);
    return result.insertId;
};

const findAll = async () => {
    const query = 'SELECT * FROM mam_attendance;';
    const [rows] = await pool.query(query);
    return rows;
};

const findByPk = async (id) => {
    const query = 'SELECT * FROM mam_attendance WHERE id = ?;';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const updateById = async (id, data) => {
    const { API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename, Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude } = data;
    const query = `
    UPDATE mam_attendance
    SET API_User_ID = ?, Upload_timestamp = ?, Matched_User_ID = ?, Image_filename = ?, Image_storage_path = ?, match_outcome = ?, Status_Pending = ?, Latitude = ?, Longitude = ?
    WHERE id = ?;
    `;
    const [result] = await pool.query(query, [API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename, Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude, id]);
    return result.affectedRows > 0;
};

const deleteById = async (id) => {
    const query = 'DELETE FROM mam_attendance WHERE id = ?;';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
};

module.exports = {
    initialize,
    create,
    findAll,
    findByPk,
    updateById,
    deleteById
};
