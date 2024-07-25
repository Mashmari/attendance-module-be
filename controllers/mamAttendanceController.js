const MamAttendance = require('../models/mamAttendanceModel');
const MamSchool = require('../models/mamSchoolModel');
const MamSchoolData = require('../models/mamSchoolModel');


exports.createRecord = async (req, res) => {
  try {
    const {
      API_User_ID,
      Upload_timestamp,
      Matched_Student_ID,
      Image_filename,
      Image_storage_path,
      match_outcome,
      Latitude,
      Longitude,
      Status_Pending = "Yes",
    } = req.body;

    // Check if API_User_ID exists in mam_schools
    const school = await MamSchool.findOne({ where: { API_User_ID } });

    if (!school) {
      return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
    }

    const newRecord = await MamAttendance.create({
      API_User_ID,
      Upload_timestamp,
      Matched_Student_ID,
      Image_filename,
      Image_storage_path,
      match_outcome,
      Latitude,
      Longitude,
      Status_Pending,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

// Get all records with pagination
exports.getAllRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await MamAttendance.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: MamSchoolData,
          required: true, // INNER JOIN
        },
      ],
    });

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      records: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a record by API_User_ID
exports.getRecordById = async (req, res) => {
  try {
    const { API_User_ID } = req.params;
    const record = await MamAttendance.findByPk(API_User_ID);

    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a record by API_User_ID
exports.updateRecord = async (req, res) => {
  try {
    const { API_User_ID } = req.params;
    const {
      Upload_timestamp,
      Matched_Student_ID,
      Image_filename,
      Image_storage_path,
      match_outcome,
      Latitude,
      Longitude,
      Status_Pending, // Include Status_Pending
    } = req.body;

    const record = await MamAttendance.findByPk(API_User_ID);

    if (record) {
      record.Upload_timestamp = Upload_timestamp;
      record.Matched_Student_ID = Matched_Student_ID;
      record.Image_filename = Image_filename;
      record.Image_storage_path = Image_storage_path;
      record.match_outcome = match_outcome;
      record.Latitude = Latitude;
      record.Longitude = Longitude;
      record.Status_Pending = Status_Pending; // Update Status_Pending

      await record.save();
      res.status(200).json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a record by API_User_ID
exports.deleteRecord = async (req, res) => {
  try {
    const { API_User_ID } = req.params;
    const record = await MamAttendance.findByPk(API_User_ID);

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