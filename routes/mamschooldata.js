// routes/mamSchoolDataRoutes.js

const express = require('express');
const mamschooldataController = require('../controllers/mamschooldataController');

const router = express.Router();

router.post('/create', mamschooldataController.createRecord);
router.get('/get', mamschooldataController.getAllRecords);
router.get('/getbyid/:id', mamschooldataController.getRecordById);
router.put('/updatebyid/:id', mamschooldataController.updateRecordById);
router.delete('/deletebyid/:id', mamschooldataController.deleteRecordById);

module.exports = router;
