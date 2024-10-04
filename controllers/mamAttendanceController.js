const pool = require("../config/database");
const MamAttendance = require("../models/mamAttendanceModel");
const MamSchoolData = require("../models/mamSchoolModel");
const path = require("path");
const db = require('../config/database');

// Create a new record
// exports.createRecord = async (req, res) => {
//     try {
//         const {
//             API_User_ID,
//             Upload_timestamp,
//             Matched_User_ID,
//             Image_filename,
//             Image_storage_path,
//             match_outcome,
//             Latitude,
//             Longitude,
//             Status_Pending = "Yes",
//         } = req.body;

//         // Check if API_User_ID exists in mam_schools
//         const school = await MamSchool.findByApiUserId(API_User_ID);

//         if (!school) {
//             return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
//         }

//         const newRecordId = await MamAttendance.create({
//             API_User_ID,
//             Upload_timestamp,
//             Matched_User_ID,
//             Image_filename,
//             Image_storage_path,
//             match_outcome,
//             Latitude,
//             Longitude,
//             Status_Pending,
//         });

//         res.status(201).json({ id: newRecordId });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };
exports.createRecord = async (req, res) => {
    try {
        const {
            API_User_ID,
            Upload_timestamp,
            Matched_User_ID,
            Image_filename,
            Image_storage_path,
            match_outcome,
            Latitude,
            Longitude,
            Status_Pending = "Yes",
        } = req.body;

        // Check if API_User_ID exists in mam_schools
        const [school] = await pool.query('SELECT * FROM mam_schools WHERE API_User_ID = ?', [API_User_ID]);

        if (!school.length) {
            return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
        }

        // Convert ISO 8601 to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
        const formattedTimestamp = Upload_timestamp ? new Date(Upload_timestamp).toISOString().slice(0, 19).replace('T', ' ') : null;

        // Sanitize input values, replacing undefined with null
        const sanitizedValues = {
            API_User_ID: API_User_ID || null,
            Upload_timestamp: formattedTimestamp,
            Matched_User_ID: Matched_User_ID || null,
            Image_filename: Image_filename || null,
            Image_storage_path: path.join(process.env.FILE_ROOT_PATH, Image_storage_path) || null,
            // Image_storage_path: Image_storage_path|| null,
            match_outcome: match_outcome || null,
            Status_Pending: Status_Pending || "Yes",
            Latitude: Latitude || null,
            Longitude: Longitude || null,
        };

        // Prepare the SQL query
        const query = `
            INSERT INTO attendance.mam_attendances (
                API_User_ID, Upload_timestamp, Matched_User_ID, Image_filename,
                Image_storage_path, match_outcome, Status_Pending, Latitude, Longitude
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the SQL query
        await pool.execute(query, [
            sanitizedValues.API_User_ID,
            sanitizedValues.Upload_timestamp,
            sanitizedValues.Matched_User_ID,
            sanitizedValues.Image_filename,
            sanitizedValues.Image_storage_path,
            sanitizedValues.match_outcome,
            sanitizedValues.Status_Pending,
            sanitizedValues.Latitude,
            sanitizedValues.Longitude
        ]);

        // Return a success message
        res.status(201).json({ message: 'Record created successfully' });
    } catch (error) {
        console.error('Error creating record:', error.message);
        res.status(500).json({ error: error.message });
    }
};


// Get all records with pagination
exports.getAllRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10; // Fixed limit for pagination
        const offset = (page - 1) * limit;

        // Query to get the paginated records, including School_Name, sorted by Upload_timestamp in descending order
        const [rows] = await pool.query(
            `SELECT a.*, s.School_Name, s.Class_Name
             FROM mam_attendances a
             LEFT JOIN mam_schools s ON a.API_User_ID = s.API_User_ID
             ORDER BY a.Upload_timestamp DESC
             LIMIT ?, ?`,
            [offset, limit]
        );

        // Query to get the total number of records
        const [[{ totalRecords }]] = await pool.query(
            `SELECT COUNT(*) AS totalRecords
             FROM mam_attendances a
             LEFT JOIN mam_schools s ON a.API_User_ID = s.API_User_ID`
        );

        // Add image URLs to each record
        const updatedRows = rows.map(row => {
            const imageUrl = path.join(row.Image_storage_path, row.Image_filename);
            return {
                ...row,
                imageUrl,
            };
        });

        res.status(200).json({
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            records: updatedRows,
        });
    } catch (error) {
        console.error('Error fetching records with pagination:', error.message);
        res.status(500).json({ error: error.message });
    }
};







// Get a record by API_User_ID
// exports.getRecordById = async (req, res) => {
//     try {
//         const { API_User_ID } = req.params;
//         const [record] = await MamAttendance.findById(API_User_ID);

//         if (record) {
//             res.status(200).json(record);
//         } else {
//             res.status(404).json({ message: "Record not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
//Get record by id
exports.getRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM mam_attendances WHERE id = ?';
        const [rows] = await db.execute(query, [id]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update a record by id (primary key)
exports.updateRecord = async (req, res) => {
    try {
        const { id } = req.params; // Use id as the primary key
        const {
            Upload_timestamp,
            Matched_User_ID,
            Image_filename,
            Image_storage_path,
            match_outcome,
            Latitude,
            Longitude,
            Status_Pending,
        } = req.body;

        const updated = await MamAttendance.updateById(id, {
            Upload_timestamp,
            Matched_User_ID,
            Image_filename,
            Image_storage_path,
            match_outcome,
            Latitude,
            Longitude,
            Status_Pending,
        });

        if (updated) {
            const record = await MamAttendance.findByPk(id); // Find the record by id
            res.status(200).json(record);
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Delete a record by id (primary key)
exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params; // Use id as the primary key
        const deleted = await MamAttendance.deleteById(id);

        if (deleted) {
            res.status(204).send(); // Successfully deleted, no content to return
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Serve image file
exports.getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const [record] = await MamAttendance.findById(id);

        if (record) {
            const imagePath = path.join(record.Image_storage_path, record.Image_filename);
            res.sendFile(imagePath);
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

