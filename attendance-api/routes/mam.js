const express = require('express');
const mamController = require('../controllers/mamController');

const router = express.Router();

router.post('/create', mamController.createRecord);
router.get('/get', mamController.getAllRecords);
router.get('/getbyid/:id', mamController.getRecordById);
router.put('/updatebyid/:id', mamController.updateRecord);
router.delete('/deletebyid/:id', mamController.deleteRecord);


module.exports = router;
