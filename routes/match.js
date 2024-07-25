const express = require('express');
const router = express.Router();
const MamSchool = require('../models/mamAttendanceModel');
const mamSchoolStudent = require('../models/mamSchoolStudentModel');

// POST request to match Matched_Student_ID and Student_ID
router.post('/match', async (req, res) => {
  try {
    const { matchedUserID,Image_storage_path,Image_filename } = req.body;

    // Find records in both tables
    const mamSchoolRecord = await Image.findOne({ where: { Student_ID: matchedUserID } });


    if (mamSchoolRecord) {
      // Update the record with the new values
      await mamSchoolRecord.update({
        Ref_Image_filepath: Image_storage_path,
        Ref_Image_filename: Image_filename
      });

      res.status(200).json({
        message: 'Match found and updated',
        mamSchoolRecord
      });
    } else {
      res.status(404).json({ message: 'No matching records found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
    console.log(error);
  }
});

module.exports = router;
