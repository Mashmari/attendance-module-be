const express = require('express');
const mamAttendanceController = require('../controllers/mamAttendanceController');

const router = express.Router();

router.post('/create', mamAttendanceController.createRecord);
router.get('/get', mamAttendanceController.getAllRecords);
router.get('/getbyid/:API_User_ID', mamAttendanceController.getRecordById);
router.put('/updatebyid/:API_User_ID', mamAttendanceController.updateRecord);
router.delete('/deletebyid/:API_User_ID', mamAttendanceController.deleteRecord);


module.exports = router;
