const MamSchool = require('../models/mamschool');

// Create a new record
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
    } = req.body;

    const newRecord = await MamSchool.create({
      API_User_ID,
      Upload_timestamp,
      Matched_User_ID,
      Image_filename,
      Image_storage_path,
      match_outcome,
      Latitude,
      Longitude,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await MamSchool.findAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a record by ID
exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MamSchool.findByPk(id);

    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a record by ID
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      API_User_ID,
      Upload_timestamp,
      Matched_User_ID,
      Image_filename,
      Image_storage_path,
      match_outcome,
      Latitude,
      Longitude,
    } = req.body;

    const record = await MamSchool.findByPk(id);

    if (record) {
      record.API_User_ID = API_User_ID;
      record.Upload_timestamp = Upload_timestamp;
      record.Matched_User_ID = Matched_User_ID;
      record.Image_filename = Image_filename;
      record.Image_storage_path = Image_storage_path;
      record.match_outcome = match_outcome;
      record.Latitude = Latitude;
      record.Longitude = Longitude;

      await record.save();
      res.status(200).json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a record by ID
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MamSchool.findByPk(id);

    if (record) {
      await record.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
