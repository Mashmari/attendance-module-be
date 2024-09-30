const MamSchoolStudent = require("../models/mamSchoolStudentModel");
const MamAttendance = require("../models/mamAttendanceModel");
const MamSchoolData = require("../models/mamSchoolModel");
const fs = require("fs");
const path = require("path");
const db = require('../config/database');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const tempFolderPath = path.join(process.env.FILE_ROOT_PATH, 'CDOT', 'CIAS_DATA', 'TEMP');
//     cb(null, tempFolderPath); // Save initially to TEMP folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Save with original filename
//   }
// });

// const upload = multer({ storage: storage });

// const multer = require('multer');

// Configure multer for memory storage (no local temp storage)
const upload = multer({ storage: multer.memoryStorage() });



// Function to generate an auto-increment number for Student_ID starting from 100
const getAutoNumber = async () => {
  const [result] = await db.query(
    `SELECT MAX(CAST(Student_ID AS UNSIGNED)) AS maxId FROM mam_school_students`
  );

  const maxId = result[0].maxId;
  return maxId ? maxId + 1 : 100;
};





// Controller to create a new student record with an image
// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region:process.env.AWS_REGION                      //'your-region' // Replace with your AWS region
});

exports.createStudentWithImage = async (req, res) => {
  const connection = await db.getConnection(); // Get DB connection
  try {
    const { School_Name, Class_Name, StudentName } = req.body;
    const image = req.file;  // Multer stores the file in memory (buffer)
    
    if (!School_Name || !Class_Name || !StudentName || !image) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    // Fetch school details
    const [schoolDataResults] = await connection.query(`
      SELECT School_ID, Class_ID, Location_ID 
      FROM mam_schools 
      WHERE School_Name = ? AND Class_Name = ?`, [School_Name, Class_Name]);
    
    if (schoolDataResults.length === 0) {
      return res.status(400).json({ error: "School or Class does not exist." });
    }

    const { School_ID, Class_ID, Location_ID } = schoolDataResults[0];
    const studentId = await getAutoNumber();

    // Define S3 upload params, directly using the buffer from multer's memory storage
    const imageFilename = `${StudentName}_${studentId}.jpg`;
    const s3FilePath = `${Location_ID}/faces-repository/${imageFilename}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME, // S3 bucket name from env
      Key: s3FilePath,                    // File path in S3
      Body: image.buffer,                 // Use the buffer from memory (no local temp storage)
      ContentType: image.mimetype,        // Automatically detect the content type
    };

    // Upload image to S3
    await s3.upload(uploadParams).promise();

    // Insert student details into the DB
    const insertQuery = `
      INSERT INTO mam_school_students 
      (School_ID, Class_ID, Student_ID, Ref_Image_filename, Ref_Image_filepath, Ref_Image_Create_DateTime, Ref_Image_Update_DateTime, Ref_Image_Update_Count, Location_ID, StudentName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await connection.query(insertQuery, [
      School_ID, Class_ID, studentId, imageFilename, s3FilePath, new Date(), new Date(), 0, Location_ID, StudentName
    ]);

    res.status(201).json({ message: "Student created and image uploaded to S3.", S3FilePath: s3FilePath });
  } catch (error) {
    await connection.rollback(); // Rollback DB in case of error
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release(); // Always release the connection
  }
};



// const AWS = require('aws-sdk');

// Configure AWS S3
// const s3 = new AWS.S3();

exports.createImage = async (req, res) => {
  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    const { StudentName, id } = req.body; // Extract 'id' from req.body

    // Validate input
    if (!StudentName) {
      return res.status(400).json({ error: "StudentName is required" });
    }

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    await connection.beginTransaction(); // Start a transaction

    // Fetch the attendance record using the provided id
    const [attendanceRecords] = await connection.query(
      "SELECT * FROM mam_attendances WHERE id = ? AND Status_Pending = 'Yes' LIMIT 1 FOR UPDATE",
      [id]
    );

    // Check if the attendance record exists
    if (attendanceRecords.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "No pending attendance records found for the provided ID" });
    }

    const attendanceRecord = attendanceRecords[0];
    const { API_User_ID, Image_storage_path, Image_filename } = attendanceRecord; // Image_storage_path should be the S3 key

    // Fetch School_ID, Class_ID, Location_ID from mam_schools using API_User_ID
    const [schoolDataResults] = await connection.query(
      "SELECT School_ID, Class_ID, Location_ID FROM mam_schools WHERE API_User_ID = ? FOR UPDATE",
      [API_User_ID]
    );

    // Check if the school data exists
    if (schoolDataResults.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
    }

    const schoolData = schoolDataResults[0];
    const { School_ID, Class_ID, Location_ID } = schoolData;

    // Generate the unique Student_ID
    const studentId = await getAutoNumber();

    // Define the destination path in S3 based on Location_ID and faces-repository
    const destKey = `${Location_ID}/faces-repository/${StudentName}_${studentId}.jpg`;

    // Fetch the image from S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME, // your S3 bucket name
      Key: Image_storage_path // the key stored in your DB
    };

    try {
      // Fetch the image from the original location in S3
      const s3Object = await s3.getObject(params).promise();

      // Upload the image to the new location in S3 (Location_ID/faces-repository)
      await s3.putObject({
        Bucket: process.env.S3_BUCKET_NAME, // same bucket or another one
        Key: destKey, // the destination key (path)
        Body: s3Object.Body, // the file content
        ContentType: s3Object.ContentType // maintain original content type
      }).promise();

      console.log(`Image copied to S3: ${destKey}`);
    } catch (err) {
      await connection.rollback();
      console.error(`Error fetching or uploading image to S3: ${err.message}`);
      return res.status(500).json({ error: "Failed to fetch or upload image to S3" });
    }

    // SQL query to insert the new student record
    const insertStudentQuery = `
      INSERT INTO mam_school_students (
        School_ID, Class_ID, Student_ID, 
        Ref_Image_filename, Ref_Image_filepath, 
        Ref_Image_Create_DateTime, Ref_Image_Update_DateTime, 
        Ref_Image_Update_Count, Location_ID, StudentName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertStudentValues = [
      School_ID,
      Class_ID,
      studentId,
      `${StudentName}_${studentId}.jpg`,
      destKey, // Use the destination key (S3 path)
      new Date(),
      new Date(),
      0, // Ref_Image_Update_Count
      Location_ID,
      StudentName
    ];

    // Insert the new student record into the database
    await connection.query(insertStudentQuery, insertStudentValues);

    // Update Status_Pending to 'No' in MamAttendance table
    await connection.query(
      "UPDATE mam_attendances SET Status_Pending = 'No' WHERE id = ?",
      [id]
    );

    await connection.commit(); // Commit the transaction

    // Send success response
    res.status(201).json({
      School_ID,
      Class_ID,
      Student_ID: studentId,
      Ref_Image_filename: `${StudentName}_${studentId}.jpg`,
      Ref_Image_filepath: destKey,
      Ref_Image_Create_DateTime: new Date(),
      Ref_Image_Update_DateTime: new Date(),
      Ref_Image_Update_Count: 0,
      Location_ID,
      StudentName,
    });
  } catch (error) {
    await connection.rollback(); // Rollback the transaction on error
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};





// exports.createImage = async (req, res) => {
//   const connection = await db.getConnection(); // Get a connection from the pool
//   try {
//     const { StudentName, id } = req.body; // Make sure to extract 'id' from req.body

//     // Validate input
//     if (!StudentName) {
//       return res.status(400).json({ error: "StudentName is required" });
//     }

//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }

//     await connection.beginTransaction(); // Start a transaction

//     // Fetch the attendance record using the provided id
//     const [attendanceRecords] = await connection.query(
//       "SELECT * FROM mam_attendances WHERE id = ? AND Status_Pending = 'Yes' LIMIT 1 FOR UPDATE",
//       [id]
//     );

//     // Check if the attendance record exists
//     if (attendanceRecords.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ error: "No pending attendance records found for the provided ID" });
//     }

//     const attendanceRecord = attendanceRecords[0];
//     const { API_User_ID, Image_storage_path, Image_filename } = attendanceRecord;

//     // Fetch School_ID, Class_ID, Location_ID from mam_schools using API_User_ID
//     const [schoolDataResults] = await connection.query(
//       "SELECT School_ID, Class_ID, Location_ID FROM mam_schools WHERE API_User_ID = ? FOR UPDATE",
//       [API_User_ID]
//     );

//     // Check if the school data exists
//     if (schoolDataResults.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
//     }

//     const schoolData = schoolDataResults[0];
//     const { School_ID, Class_ID, Location_ID } = schoolData;

//     // Generate the unique Student_ID
//     const studentId = await getAutoNumber();

//     // SQL query to insert the new student record
//     const insertStudentQuery = `
//       INSERT INTO mam_school_students (
//         School_ID, Class_ID, Student_ID, 
//         Ref_Image_filename, Ref_Image_filepath, 
//         Ref_Image_Create_DateTime, Ref_Image_Update_DateTime, 
//         Ref_Image_Update_Count, Location_ID, StudentName
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const insertStudentValues = [
//       School_ID,
//       Class_ID,
//       studentId,
//       `${StudentName}_${studentId}.jpg`,
//       path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.jpg`),
//       new Date(),
//       new Date(),
//       0, // Ref_Image_Update_Count
//       Location_ID,
//       StudentName
//     ];

//     // Insert the new student record into the database
//     await connection.query(insertStudentQuery, insertStudentValues);

//     // Define source and destination paths for image copy
//     const sourcePath = path.join(Image_storage_path);
//     const destPath = path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.jpg`);

//     // Log paths
//     console.log(`Source Path: ${sourcePath}`);
//     console.log(`Destination Path: ${destPath}`);

//     // Validate paths
//     if (!sourcePath || !destPath) {
//       await connection.rollback();
//       return res.status(500).json({ error: "Source or destination path is invalid" });
//     }

//     // Check if the source file exists
//     try {
//       await fs.promises.access(sourcePath, fs.constants.F_OK);
//     } catch (err) {
//       await connection.rollback();
//       return res.status(500).json({ error: "Source file does not exist" });
//     }

//     // Copy the image file from source to destination
//     await fs.promises.copyFile(sourcePath, destPath);
//     console.log(`Image file copied to: ${destPath}`);

//     // Update Status_Pending to 'No' in MamAttendance table
//     await connection.query(
//       "UPDATE mam_attendances SET Status_Pending = 'No' WHERE id = ?",
//       [id]
//     );

//     await connection.commit(); // Commit the transaction

//     // Send success response
//     res.status(201).json({
//       School_ID,
//       Class_ID,
//       Student_ID: studentId,
//       Ref_Image_filename: `${StudentName}_${studentId}.jpg`,
//       Ref_Image_filepath: destPath,
//       Ref_Image_Create_DateTime: new Date(),
//       Ref_Image_Update_DateTime: new Date(),
//       Ref_Image_Update_Count: 0,
//       Location_ID,
//       StudentName,
//     });
//   } catch (error) {
//     await connection.rollback(); // Rollback the transaction on error
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     connection.release(); // Release the connection back to the pool
//   }
// };








exports.getAllStudentsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Fetch students with pagination
    const [students] = await db.query(
      `SELECT SQL_CALC_FOUND_ROWS * 
       FROM mam_school_students 
       LIMIT ?, ?`,
      [offset, limit]
    );

    // Get total number of records
    const [[{ totalRecords }]] = await db.query('SELECT FOUND_ROWS() AS totalRecords');

    // Fetch additional details like School_Name and Class_Name if needed
    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const [schoolData] = await db.query(
          `SELECT School_Name, Class_Name 
           FROM mam_schools 
           WHERE School_ID = ? AND Class_ID = ?`,
          [student.School_ID, student.Class_ID]
        );

        const school = schoolData[0] || {};
        return {
          ...student,
          School_Name: school.School_Name || null,
          Class_Name: school.Class_Name || null,
        };
      })
    );

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      students: studentsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching students with pagination:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get an image record by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MamSchoolStudent.getStudentById(id);

    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: "Image not found" });
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
    } = req.body;

    // Fetch the image record
    const image = await MamSchoolStudent.getStudentById(id);

    if (image) {
      // Increment Ref_Image_Update_Count by 1
      const updatedFields = {
        School_ID,
        Class_ID,
        Student_ID,
        Ref_Image_filename: `${StudentName}_${Student_ID}.jpg`,
        Ref_Image_filepath: `process.env.PHOTO_PASTING_PATH/${StudentName}_${Student_ID}.jpg`,
        Ref_Image_Create_DateTime,
        Ref_Image_Update_DateTime,
        Ref_Image_Update_Count: image.Ref_Image_Update_Count + 1,
        Location_ID,
        StudentName,
      };

      await MamSchoolStudent.updateStudent(id, updatedFields);
      res.status(200).json({ id, ...updatedFields });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an image record by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MamSchoolStudent.getStudentById(id);

    if (image) {
      await MamSchoolStudent.deleteStudent(id);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get classes by school name

exports.getAllSchoolNames = async (req, res) => {
  try {
    // Query to fetch unique School_Name from the table
    const [schoolDataResults] = await db.query(
      `SELECT DISTINCT School_Name FROM mam_schools`
    );

    // Send the list of unique School_Name values back to the frontend
    res.status(200).json({ schools: schoolDataResults.map(row => row.School_Name) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getClassesBySchoolName = async (req, res) => {
  try {
    const { School_Name } = req.body;  // Ensure it reads from req.body

    if (!School_Name) {
      return res.status(400).json({ error: "School_Name is required" });
    }

    // Query to fetch unique Class_Name based on School_Name
    const [classDataResults] = await db.query(
      `SELECT DISTINCT Class_Name FROM mam_schools WHERE School_Name = ?`,
      [School_Name]
    );

    if (classDataResults.length === 0) {
      return res.status(404).json({ error: "No classes found for the given School_Name" });
    }

    res.status(200).json({ classes: classDataResults.map(row => row.Class_Name) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


