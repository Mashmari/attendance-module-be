
// const MamSchoolStudent = require('../models/mamSchoolStudentModel');
// const MamAttendance = require('../models/mamAttendanceModel');
// const MamSchoolData = require('../models/mamSchoolModel');
// const MamSchool = require('../models/mamSchoolModel');



// exports.createImage = async (req, res) => {
//   try {
//     const { id, StudentName } = req.body;

//     // Fetch API_User_ID from MamAttendance using the provided id
//     const attendanceRecord = await MamAttendance.findByPk(id);

//     if (!attendanceRecord) {
//       return res.status(400).json({ error: "ID does not exist in mam_attendance" });
//     }

//     const { API_User_ID } = attendanceRecord;

//     // Fetch School_ID, Class_ID, and School_Location_ID from MamSchoolData using the API_User_ID
//     const schoolData = await MamSchoolData.findOne({ where: { API_User_ID } });

//     if (!schoolData) {
//       return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
//     }

//     const { School_ID, Class_ID, Location_ID } = schoolData;

//     // Log the retrieved values
//     console.log(`School_ID: ${School_ID}, Class_ID: ${Class_ID}, Location_ID: ${Location_ID}`);

//     // Create the MamSchoolStudent record
//     const newStudent = await MamSchoolStudent.create({
//       id, // id is the foreign key and primary key
//       School_ID,
//       Class_ID,
//       Student_ID: '', // Temporary empty value, will be updated below
//       Ref_Image_filename: '',
//       Ref_Image_filepath: '',
//       Ref_Image_Create_DateTime: new Date(),
//       Ref_Image_Update_DateTime: new Date(),
//       Ref_Image_Update_Count: 0,
//       Location_ID, // Use the School_Location_ID fetched from MamSchoolData
//       StudentName,
//       Param1: '',
//       Param2: '',
//     });

//     // Generate the Student_ID
//     const studentId = `${School_ID}${Class_ID}${id}`;
//     newStudent.Student_ID = studentId;

//     // Generate the image filename and update the record
//     const imageFilename = `${StudentName}_${studentId}.JPG`;
//     newStudent.Ref_Image_filename = imageFilename;
//     newStudent.Ref_Image_filepath = `C:/Users/CDOT/CIAS_DATA/ENROLL_IMG/${imageFilename}`;
    
//     await newStudent.save();

//     // Update Status_Pending to 'No' in MamSchool table
//     await MamSchool.update(
//       { Status_Pending: 'No' },
//       { where: { Matched_Student_ID: newStudent.Student_ID } }
//     );

//     res.status(201).json(newStudent);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all image records with pagination
// exports.getAllImages = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const { count, rows } = await MamSchoolStudent.findAndCountAll({
//       offset,
//       limit,
//     });

//     res.status(200).json({
//       totalRecords: count,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       images: rows,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get an image record by ID
// exports.getImageById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const image = await MamSchoolStudent.findByPk(id);

//     if (image) {
//       res.status(200).json(image);
//     } else {
//       res.status(404).json({ message: 'Image not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update an image record by ID
// exports.updateImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       School_ID,
//       Class_ID,
//       Student_ID,
//       Ref_Image_Create_DateTime,
//       Ref_Image_Update_DateTime,
//       Ref_Image_Update_Count,
//       Location_ID,
//       StudentName,
//       Param1,
//       Param2,
//     } = req.body;

//     const image = await MamSchoolStudent.findByPk(id);

//     if (image) {
//       image.School_ID = School_ID;
//       image.Class_ID = Class_ID;
//       image.Student_ID = Student_ID;
//       image.Ref_Image_filename = `${StudentName}_${image.Student_ID}.JPG`;
//       image.Ref_Image_filepath = `C:/Users/CDOT/CIAS_DATA/ENROLL_IMG/${image.Ref_Image_filename}`;
//       image.Ref_Image_Create_DateTime = Ref_Image_Create_DateTime;
//       image.Ref_Image_Update_DateTime = Ref_Image_Update_DateTime;
//       image.Ref_Image_Update_Count = Ref_Image_Update_Count;
//       image.Location_ID = Location_ID;
//       image.StudentName = StudentName;
//       image.Param1 = Param1;
//       image.Param2 = Param2;

//       await image.save();
//       res.status(200).json(image);
//     } else {
//       res.status(404).json({ message: 'Image not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete an image record by ID
// exports.deleteImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const image = await MamSchoolStudent.findByPk(id);

//     if (image) {
//       await image.destroy();
//       res.status(204).send();
//     } else {
//       res.status(404).json({ message: 'Image not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const MamSchoolStudent = require('../models/mamSchoolStudentModel');
const MamAttendance = require('../models/mamAttendanceModel');
const MamSchoolData = require('../models/mamSchoolModel');
const MamSchool = require('../models/mamSchoolModel');

// Create a new image record
exports.createImage = async (req, res) => {
  try {
    const { id, StudentName } = req.body;

    // Fetch API_User_ID from MamAttendance using the provided id
    const attendanceRecord = await MamAttendance.findByPk(id);

    if (!attendanceRecord) {
      return res.status(400).json({ error: "ID does not exist in mam_attendance" });
    }

    const { API_User_ID } = attendanceRecord;

    // Fetch School_ID, Class_ID, and School_Location_ID from MamSchoolData using the API_User_ID
    const schoolData = await MamSchoolData.findOne({ where: { API_User_ID } });

    if (!schoolData) {
      return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
    }

    const { School_ID, Class_ID, Location_ID } = schoolData;

    // Log the retrieved values
    console.log(`School_ID: ${School_ID}, Class_ID: ${Class_ID}, Location_ID: ${Location_ID}`);

    // Create the MamSchoolStudent record
    const newStudent = await MamSchoolStudent.create({
      id, // id is the foreign key and primary key
      School_ID,
      Class_ID,
      Student_ID: '', // Temporary empty value, will be updated below
      Ref_Image_filename: '',
      Ref_Image_filepath: '',
      Ref_Image_Create_DateTime: new Date(),
      Ref_Image_Update_DateTime: new Date(),
      Ref_Image_Update_Count: 0, // Set to 0 for new records
      Location_ID, // Use the School_Location_ID fetched from MamSchoolData
      StudentName,
      Param1: '',
      Param2: '',
    });

    // Generate the Student_ID
    const studentId = `${School_ID}${Class_ID}${id}`;
    newStudent.Student_ID = studentId;

    // Generate the image filename and update the record
    const imageFilename = `${StudentName}_${studentId}.JPG`;
    newStudent.Ref_Image_filename = imageFilename;
    newStudent.Ref_Image_filepath = `C:/Users/CDOT/CIAS_DATA/ENROLL_IMG/${imageFilename}`;
    
    await newStudent.save();

    // Update Status_Pending to 'No' in MamSchool table
    await MamSchool.update(
      { Status_Pending: 'No' },
      { where: { Matched_Student_ID: newStudent.Student_ID } }
    );

    res.status(201).json(newStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all image records with pagination
exports.getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await MamSchoolStudent.findAndCountAll({
      offset,
      limit,
    });

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      images: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an image record by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MamSchoolStudent.findByPk(id);

    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an image record by ID
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      School_ID,
      Class_ID,
      Student_ID,
      Ref_Image_Create_DateTime,
      Ref_Image_Update_DateTime,
      Ref_Image_Update_Count,
      Location_ID,
      StudentName,
      Param1,
      Param2,
    } = req.body;

    const image = await MamSchoolStudent.findByPk(id);

    if (image) {
      // Increment Ref_Image_Update_Count by 1
      image.Ref_Image_Update_Count += 1;
      
      image.School_ID = School_ID;
      image.Class_ID = Class_ID;
      image.Student_ID = Student_ID;
      image.Ref_Image_filename = `${StudentName}_${Student_ID}.JPG`;
      image.Ref_Image_filepath = `C:/Users/CDOT/CIAS_DATA/ENROLL_IMG/${image.Ref_Image_filename}`;
      image.Ref_Image_Create_DateTime = Ref_Image_Create_DateTime;
      image.Ref_Image_Update_DateTime = Ref_Image_Update_DateTime;
      image.Location_ID = Location_ID;
      image.StudentName = StudentName;
      image.Param1 = Param1;
      image.Param2 = Param2;

      await image.save();
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an image record by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MamSchoolStudent.findByPk(id);

    if (image) {
      await image.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
