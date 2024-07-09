const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('/create', imageController.createImage);
router.get('/get', imageController.getAllImages);
router.get('/viewrecordbyid/:id', imageController.getImageById);
router.put('/updaterecordbyid/:id', imageController.updateImage);
router.delete('/deleterecordbyid/:id', imageController.deleteImage);

module.exports = router;
