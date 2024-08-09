const pool = require('../config/database');
const MamSchoolData = require('../models/mamSchoolModel');

// Create a new entry
// exports.createRecord = async (req, res) => {
//     try {
//         const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

//         if (!School_ID || !School_Name || !Class_ID || !Class_Name || !API_User_ID || !Location_ID) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const newEntryId = await MamSchoolData.create({
//             School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID
//         });

//         res.status(201).json({ message: 'Entry created successfully', id: newEntryId });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//         console.log(error)
//     }
// };
exports.createRecord = async (req, res) => {
    try {
        const { School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID } = req.body;

        if (!School_ID || !School_Name || !Class_ID || !Class_Name || !API_User_ID || !Location_ID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = `
            INSERT INTO attendance.mam_schools (School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [School_ID, School_Name, Class_ID, Class_Name, API_User_ID, Location_ID]);

        res.status(201).json({ message: 'Entry created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

// Get all entries
exports.getAllRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const entries = await MamSchoolData.findAll({ page: parseInt(page, 10), limit: parseInt(limit, 10) });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single entry by ID (API_User_ID)
exports.getRecordById = async (req, res) => {
    try {
        const entry = await MamSchoolData.findByApiUserId(req.params.id);
        if (entry) {
            res.status(200).json(entry);
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an entry by ID (API_User_ID)
exports.updateRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updated = await MamSchoolData.updateByApiUserId(id, updatedData);
        if (updated) {
            const updatedEntry = await MamSchoolData.findByApiUserId(id);
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
    try {
        const { id } = req.params;

        const deleted = await MamSchoolData.deleteByApiUserId(id);
        if (deleted) {
            res.status(204).json({ message: 'Entry deleted' });
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
