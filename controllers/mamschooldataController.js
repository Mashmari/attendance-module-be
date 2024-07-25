const MamSchoolData = require('../models/mamSchoolModel');

// Create a new entry
exports.createRecord = async (req, res) => {
    try {
        const newEntry = await MamSchoolData.create(req.body);
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all entries
exports.getAllRecords = async (req, res) => {
    try {
        const entries = await MamSchoolData.findAll();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single entry by ID (API_User_ID)
exports.getRecordById = async (req, res) => {
    try {
        const entry = await MamSchoolData.findByPk(req.params.id);
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
        const [updated] = await MamSchoolData.update(req.body, {
            where: { API_User_ID: req.params.id }
        });
        if (updated) {
            const updatedEntry = await MamSchoolData.findByPk(req.params.id);
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
        const deleted = await MamSchoolData.destroy({
            where: { API_User_ID: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Entry deleted' });
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
