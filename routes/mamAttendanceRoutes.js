const express = require('express');
const mamAttendanceController = require('../controllers/mamAttendanceController');

const router = express.Router();

// router.post('/create', mamController.createRecord);
// router.get('/get', mamController.getAllRecords);
// router.get('/getbyid/:id', mamController.getRecordById);
// router.put('/updatebyid/:id', mamController.updateRecord);
// router.delete('/deletebyid/:id', mamController.deleteRecord);

router.post('/create', mamAttendanceController.createRecord);
router.get('/get', mamAttendanceController.getAllRecords);
router.get('/getbyid/:API_User_ID', mamAttendanceController.getRecordById);
router.put('/updatebyid/:API_User_ID', mamAttendanceController.updateRecord);
router.delete('/deletebyid/:API_User_ID', mamAttendanceController.deleteRecord);


module.exports = router;
