const express = require('express');
const mamAttendanceController = require('../controllers/mamAttendanceController');

const router = express.Router();

router.post('/create', mamAttendanceController.createRecord);
router.get('/get', mamAttendanceController.getAllRecords);
router.get('/getbyid/:id', mamAttendanceController.getRecordById);
router.put('/updatebyid/:id', mamAttendanceController.updateRecord);
router.delete('/deletebyid/:id', mamAttendanceController.deleteRecord);


module.exports = router;
