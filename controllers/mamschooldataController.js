// const pool = require('../config/database');
// const MamSchoolData = require('../models/mamSchoolModel');

// // Create a new entry
// // exports.createRecord = async (req, res) => {
// //     try {
// //         const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

// //         if (!School_ID || !School_Name || !Class_ID || !Class_Name || !API_User_ID || !Location_ID) {
// //             return res.status(400).json({ message: 'All fields are required' });
// //         }

// //         const newEntryId = await MamSchoolData.create({
// //             School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID
// //         });

// //         res.status(201).json({ message: 'Entry created successfully', id: newEntryId });
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //         console.log(error)
// //     }
// // };
// exports.createRecord = async (req, res) => {
//     try {
//         const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

//         if (!School_ID || !School_Name || !Class_ID || !Class_Name || !API_User_ID || !Location_ID) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const query = `
//             INSERT INTO attendance.mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;

//         const [result] = await pool.execute(query, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);

//         res.status(201).json({ message: 'Entry created successfully', id: result.insertId });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//         console.error(error);
//     }
// };

// // Get all entries
// exports.getAllRecords = async (req, res) => {
//     try {
//         const query = `
//             SELECT * FROM mam_schools LIMIT 10
//         `;

//         const [rows] = await pool.execute(query);

//         res.status(200).json(rows);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//         console.error(error);
//     }
// };


// // Get a single entry by ID (API_User_ID)
// exports.getRecordById = async (req, res) => {
//     try {
//         const entry = await MamSchoolData.findByApiUserId(req.params.id);
//         if (entry) {
//             res.status(200).json(entry);
//         } else {
//             res.status(404).json({ message: 'Entry not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update an entry by ID (API_User_ID)
// exports.updateRecordById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedData = req.body;

//         const updated = await MamSchoolData.updateByApiUserId(id, updatedData);
//         if (updated) {
//             const updatedEntry = await MamSchoolData.findByApiUserId(id);
//             res.status(200).json(updatedEntry);
//         } else {
//             res.status(404).json({ message: 'Entry not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Delete an entry by ID (API_User_ID)
// exports.deleteRecordById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deleted = await MamSchoolData.deleteByApiUserId(id);
//         if (deleted) {
//             res.status(204).json({ message: 'Entry deleted' });
//         } else {
//             res.status(404).json({ message: 'Entry not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../config/database'); // Ensure you're using the correct database pool config

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Create a new entry and S3 folders
exports.createRecord = async (req, res) => {
    const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

    if (!School_ID || !School_Name || !Class_ID || !Class_Name || !API_User_ID || !Location_ID) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Get a connection from the MySQL pool
        const connection = await pool.getConnection();

        // Insert school data into the MySQL database
        const insertQuery = `
            INSERT INTO attendance.mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.query(insertQuery, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);

        // Define the folder paths to create in S3
        const faceRepositoryFolder = `${Location_ID}/faces-repository/`;
        const capturedImagesFolder = `${Location_ID}/captured-images/`;

        // Create folders in S3
        const folderParams = [
            { Bucket: process.env.S3_BUCKET_NAME, Key: faceRepositoryFolder, Body: '' },
            { Bucket: process.env.S3_BUCKET_NAME, Key: capturedImagesFolder, Body: '' },
        ];

        for (let params of folderParams) {
            try {
                const command = new PutObjectCommand(params);
                await s3Client.send(command);
                console.log(`Folder created: ${params.Key}`);
            } catch (err) {
                console.error(`Failed to create folder ${params.Key}`, err);
                // Release the connection if folder creation fails
                connection.release();
                return res.status(500).json({ message: `Error creating folder ${params.Key}: ${err.message}` });
            }
        }

        // Release the database connection back to the pool
        connection.release();

        res.status(201).json({
            success: true,
            message: 'School data created successfully and folders created in S3.',
            id: result.insertId, // Return the newly created ID
        });
    } catch (error) {
        console.error('Error creating school data and folders:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Get all entries
exports.getAllRecords = async (req, res) => {
    try {
        const query = `
            SELECT * FROM attendance.mam_schools LIMIT 10
        `;

        const [rows] = await pool.execute(query);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

// Get a single entry by ID (API_User_ID)
exports.getRecordById = async (req, res) => {
    try {
        const query = `
            SELECT * FROM attendance.mam_schools WHERE API_User_ID = ?
        `;

        const [rows] = await pool.execute(query, [req.params.id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an entry by ID (API_User_ID)
exports.updateRecordById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const query = `
            UPDATE attendance.mam_schools SET 
            School_Name = ?, Class_ID = ?, Class_Name = ?, Location_ID = ?
            WHERE API_User_ID = ?
        `;

        const [result] = await pool.execute(query, [updatedData.School_Name, updatedData.Class_ID, updatedData.Class_Name, updatedData.Location_ID, id]);

        if (result.affectedRows > 0) {
            const updatedEntry = await exports.getRecordById(req, res);
            res.status(200).json(updatedEntry);
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an entry by ID (API_User_ID)
exports.deleteRecordById = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            DELETE FROM attendance.mam_schools WHERE API_User_ID = ?
        `;

        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows > 0) {
            res.status(204).json({ message: 'Entry deleted' });
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
