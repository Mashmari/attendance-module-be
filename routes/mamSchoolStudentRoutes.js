const express = require('express');
const mamSchoolStudentController = require('../controllers/mamSchoolStudentController');
const multer = require('multer');

const router = express.Router();

router.post('/create', mamSchoolStudentController.createImage);
router.get('/get', mamSchoolStudentController.getAllStudentsWithPagination );
router.get('/viewrecordbyid/:id', mamSchoolStudentController.getImageById);
router.put('/updaterecordbyid/:id', mamSchoolStudentController.updateImage);
router.delete('/deleterecordbyid/:id', mamSchoolStudentController.deleteImage);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.env.PHOTO_PASTING_PATH); // Set the destination path
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename or a temporary one
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/createStudentWithImage', upload.single('image'), mamSchoolStudentController.createStudentWithImage);

router.get('/getClassesBySchoolName', mamSchoolStudentController.getClassesBySchoolName);

module.exports = router;
