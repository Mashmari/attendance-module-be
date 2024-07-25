const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// CRUD routes
router.post('/create', attendanceController.createAttendance);
router.get('/get', attendanceController.getAllAttendance);
router.get('/getbyid/:id', attendanceController.getAttendanceById);
router.put('/updatebyid/:id', attendanceController.updateAttendance);
router.delete('/deletebyid/:id', attendanceController.deleteAttendance);

module.exports = router;
