const express = require('express');
const mamSchoolStudentController = require('../controllers/mamSchoolStudentController');

const router = express.Router();

router.post('/create', mamSchoolStudentController.createImage);
router.get('/get', mamSchoolStudentController.getAllImages);
router.get('/viewrecordbyid/:id', mamSchoolStudentController.getImageById);
router.put('/updaterecordbyid/:id', mamSchoolStudentController.updateImage);
router.delete('/deleterecordbyid/:id', mamSchoolStudentController.deleteImage);

module.exports = router;
