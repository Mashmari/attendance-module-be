const MamSchoolStudent = require("../models/mamSchoolStudentModel");
const MamAttendance = require("../models/mamAttendanceModel");
const MamSchoolData = require("../models/mamSchoolModel");
const fs = require("fs");
const path = require("path");
const db = require('../config/database');
const multer = require('multer');
require('dotenv').config();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.PHOTO_PASTING_PATH); // Set the destination path
  },
  filename: function (req, file, cb) {
    const { StudentName, Student_ID } = req.body;
    cb(null, `${StudentName}_${Student_ID}.JPG`); // Set the filename
  }
});

const upload = multer({ storage: storage });

// Create a new student record with an image
// exports.createStudentWithImage = async (req, res) => {
//   try {
//     console.log('req.body:', req.body);
//     console.log('req.file:', req.file);

//     const { School_Name, Class_Name, StudentName } = req.body;
//     const image = req.file; // Image file from multer

//     // Validate input
//     if (!School_Name || !Class_Name || !StudentName || !image) {
//       return res.status(400).json({ error: "School_Name, Class_Name, StudentName, and image are required" });
//     }

//     // Fetch School_ID and Class_ID from mam_schools using School_Name and Class_Name
//     const [schoolDataResults] = await db.query(
//       `SELECT School_ID, Class_ID, Location_ID 
//        FROM mam_schools 
//        WHERE School_Name = ? AND Class_Name = ?`,
//       [School_Name, Class_Name]
//     );

//     // Check if the school data exists
//     if (schoolDataResults.length === 0) {
//       return res.status(400).json({ error: "School_Name or Class_Name does not exist in mam_schools" });
//     }

//     const schoolData = schoolDataResults[0];
//     const { School_ID, Class_ID, Location_ID } = schoolData;

//     // Generate the Student_ID
//     const autoIncrementedNumber = await getAutoIncrementedNumber(School_ID, Class_ID);
//     const studentId = `${School_ID}${Class_ID}${autoIncrementedNumber}`;

//     // Generate the image filename and filepath
//     const imageFilename = `${StudentName}_${studentId}.JPG`;
//     const imageFilepath = path.join(process.env.PHOTO_PASTING_PATH, imageFilename);

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
//       imageFilename,
//       imageFilepath,
//       new Date(),
//       new Date(),
//       0, // Ref_Image_Update_Count
//       Location_ID,
//       StudentName
//     ];

//     // Insert the new student record into the database
//     await db.query(insertStudentQuery, insertStudentValues);

//     // Define source and destination paths for image copy
//     const sourcePath = image.path; // Path from multer
//     const destPath = imageFilepath;

//     // Validate paths
//     if (!sourcePath || !destPath) {
//       return res.status(500).json({ error: "Source or destination path is invalid" });
//     }

//     // Copy the image file from source to destination
//     await fs.promises.copyFile(sourcePath, destPath);
//     console.log(`Image file copied to: ${destPath}`);

//     // Send success response
//     res.status(201).json({
//       School_ID,
//       Class_ID,
//       Student_ID: studentId,
//       Ref_Image_filename: imageFilename,
//       Ref_Image_filepath: imageFilepath,
//       Ref_Image_Create_DateTime: new Date(),
//       Ref_Image_Update_DateTime: new Date(),
//       Ref_Image_Update_Count: 0,
//       Location_ID,
//       StudentName,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // //   const connection = await db.getConnection(); // Get a connection from the pool
// // //   try {
// // //     const { StudentName } = req.body;

// // //     // Validate input
// // //     if (!StudentName) {
// // //       return res.status(400).json({ error: "StudentName is required" });
// // //     }

// // //     await connection.beginTransaction(); // Start a transaction

// // //     // Fetch the attendance record using the provided id
// // //     const [attendanceRecords] = await connection.query(
// // //       "SELECT * FROM mam_attendances WHERE Status_Pending = 'Yes' LIMIT 1 FOR UPDATE"
// // //     );

// // //     // Check if the attendance record exists
// // //     if (attendanceRecords.length === 0) {
// // //       await connection.rollback(); // Rollback the transaction
// // //       return res.status(400).json({ error: "No pending attendance records found" });
// // //     }

// // //     const attendanceRecord = attendanceRecords[0];
// // //     const { id, API_User_ID, Image_storage_path, Image_filename } = attendanceRecord;

// // //     // Fetch School_ID, Class_ID, Location_ID from mam_schools using API_User_ID
// // //     const [schoolDataResults] = await connection.query(
// // //       "SELECT School_ID, Class_ID, Location_ID FROM mam_schools WHERE API_User_ID = ? FOR UPDATE",
// // //       [API_User_ID]
// // //     );

// // //     // Check if the school data exists
// // //     if (schoolDataResults.length === 0) {
// // //       await connection.rollback(); // Rollback the transaction
// // //       return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
// // //     }

// // //     const schoolData = schoolDataResults[0];
// // //     const { School_ID, Class_ID, Location_ID } = schoolData;

// // //     // Generate a unique Student_ID using the auto-incrementing number
// // //     const studentId = await getAutoIncrementedNumber(School_ID, Class_ID, connection);

// // //     // SQL query to insert the new student record
// // //     const insertStudentQuery = `
// // //       INSERT INTO mam_school_students (
// // //         School_ID, Class_ID, Student_ID, 
// // //         Ref_Image_filename, Ref_Image_filepath, 
// // //         Ref_Image_Create_DateTime, Ref_Image_Update_DateTime, 
// // //         Ref_Image_Update_Count, Location_ID, StudentName
// // //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// // //     `;

// // //     const insertStudentValues = [
// // //       School_ID,
// // //       Class_ID,
// // //       studentId,
// // //       `${StudentName}_${studentId}.JPG`,
// // //       path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.JPG`),
// // //       new Date(),
// // //       new Date(),
// // //       0, // Ref_Image_Update_Count
// // //       Location_ID,
// // //       StudentName
// // //     ];

// // //     // Insert the new student record into the database
// // //     await connection.query(insertStudentQuery, insertStudentValues);

// // //     // Define source and destination paths for image copy
// // //     const sourcePath = path.join(Image_storage_path, Image_filename);
// // //     const destPath = path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.JPG`);

// // //     // Validate paths
// // //     if (!sourcePath || !destPath) {
// // //       await connection.rollback(); // Rollback the transaction
// // //       return res.status(500).json({ error: "Source or destination path is invalid" });
// // //     }

// // //     // Copy the image file from source to destination
// // //     await fs.promises.copyFile(sourcePath, destPath);
// // //     console.log(`Image file copied to: ${destPath}`);

// // //     // Update Status_Pending to 'No' for this specific attendance record
// // //     await connection.query(
// // //       "UPDATE mam_attendances SET Status_Pending = 'No' WHERE id = ?",
// // //       [id]
// // //     );

// // //     await connection.commit(); // Commit the transaction

// // //     // Send success response
// // //     res.status(201).json({
// // //       School_ID,
// // //       Class_ID,
// // //       Student_ID: studentId,
// // //       Ref_Image_filename: `${StudentName}_${studentId}.JPG`,
// // //       Ref_Image_filepath: destPath,
// // //       Ref_Image_Create_DateTime: new Date(),
// // //       Ref_Image_Update_DateTime: new Date(),
// // //       Ref_Image_Update_Count: 0,
// // //       Location_ID,
// // //       StudentName,
// // //     });
// // //   } catch (error) {
// // //     await connection.rollback(); // Rollback the transaction on error
// // //     console.log(error);
// // //     res.status(500).json({ error: error.message });
// // //   } finally {
// // //     connection.release(); // Release the connection back to the pool
// // //   }
// // // };


// // // Function to generate a unique Student_ID based on School_ID and Class_ID
// // async function getAutoIncrementedNumber(School_ID, Class_ID, connection) {
// //   try {
// //     // Lock the table or relevant rows to avoid race conditions
// //     await connection.query(
// //       "LOCK TABLES mam_school_students WRITE"
// //     );

// //     // Query to get the highest Student_ID that matches the given School_ID and Class_ID
// //     const [result] = await connection.query(
// //       "SELECT MAX(CAST(SUBSTRING(Student_ID, LENGTH(?) + LENGTH(?) + 1) AS UNSIGNED)) AS maxNumber FROM mam_school_students WHERE School_ID = ? AND Class_ID = ?",
// //       [School_ID, Class_ID, School_ID, Class_ID]
// //     );

// //     // Extract the highest number from the result
// //     const maxNumber = result[0].maxNumber;

// //     // Increment the number
// //     const newNumber = maxNumber ? parseInt(maxNumber) + 1 : 1;

// //     // Unlock the table
// //     await connection.query("UNLOCK TABLES");

// //     // Return the new Student_ID
// //     return `${School_ID}${Class_ID}${newNumber.toString().padStart(6, '0')}`;
// //   } catch (error) {
// //     console.error("Error fetching auto-incremented number:", error);
// //     throw new Error("Unable to fetch auto-incremented number");
// //   }
// // }
const getAutoNumber = async (School_ID, Class_ID) => {
  // Query to get the maximum Student_ID for the given School_ID and Class_ID
  const [result] = await db.query(
    `SELECT MAX(CAST(SUBSTRING(Student_ID, LENGTH(School_ID) + LENGTH(Class_ID) + 1) AS UNSIGNED)) AS maxId 
     FROM mam_school_students 
     WHERE School_ID = ? AND Class_ID = ?`,
    [School_ID, Class_ID]
  );

  const maxId = result[0].maxId;
  // If no record exists, start with 1, otherwise increment the maxId by 1
  return maxId ? maxId + 1 : 1;
};
exports.createStudentWithImage = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { School_Name, Class_Name, StudentName } = req.body;
    const image = req.file; // Image file from multer

    // Validate input
    if (!School_Name || !Class_Name || !StudentName || !image) {
      return res.status(400).json({ error: "School_Name, Class_Name, StudentName, and image are required" });
    }

    // Fetch School_ID and Class_ID from mam_schools using School_Name and Class_Name
    const [schoolDataResults] = await db.query(
      `SELECT School_ID, Class_ID, Location_ID 
       FROM mam_schools 
       WHERE School_Name = ? AND Class_Name = ?`,
      [School_Name, Class_Name]
    );

    // Check if the school data exists
    if (schoolDataResults.length === 0) {
      return res.status(400).json({ error: "School_Name or Class_Name does not exist in mam_schools" });
    }

    const schoolData = schoolDataResults[0];
    const { School_ID, Class_ID, Location_ID } = schoolData;

    // Generate the Student_ID
    const autoNumber = await getAutoNumber(School_ID, Class_ID);
    const studentId = `${School_ID}${Class_ID}${autoNumber}`;

    // Generate the image filename and filepath
    const imageFilename = `${StudentName}_${studentId}.JPG`;
    const imageFilepath = path.join("process.env.PHOTO_PASTING_PATH/", imageFilename);

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
      imageFilename,
      imageFilepath,
      new Date(),
      new Date(),
      0, // Ref_Image_Update_Count
      Location_ID,
      StudentName
    ];

    // Insert the new student record into the database
    await db.query(insertStudentQuery, insertStudentValues);

    // Define source and destination paths for image copy
    const sourcePath = image.path; // Path from multer
    const destPath = imageFilepath;

    // Validate paths
    if (!sourcePath || !destPath) {
      return res.status(500).json({ error: "Source or destination path is invalid" });
    }

    // Copy the image file from source to destination
    await fs.promises.copyFile(sourcePath, destPath);
    console.log(`Image file copied to: ${destPath}`);

    // Send success response
    res.status(201).json({
      School_ID,
      Class_ID,
      Student_ID: studentId,
      Ref_Image_filename: imageFilename,
      Ref_Image_filepath: imageFilepath,
      Ref_Image_Create_DateTime: new Date(),
      Ref_Image_Update_DateTime: new Date(),
      Ref_Image_Update_Count: 0,
      Location_ID,
      StudentName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};





exports.createImage = async (req, res) => {
  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    const { StudentName } = req.body;

    // Validate input
    if (!StudentName) {
      return res.status(400).json({ error: "StudentName is required" });
    }

    await connection.beginTransaction(); // Start a transaction

    // Fetch the attendance record using the provided id
    const [attendanceRecords] = await connection.query(
      "SELECT * FROM mam_attendances WHERE Status_Pending = 'Yes' LIMIT 1 FOR UPDATE"
    );

    // Check if the attendance record exists
    if (attendanceRecords.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "No pending attendance records found" });
    }

    const attendanceRecord = attendanceRecords[0];
    const { id, API_User_ID, Image_storage_path, Image_filename } = attendanceRecord;

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

    // Generate a unique Student_ID using the auto-incrementing number
    const studentId = await getAutoIncrementedNumber(School_ID, Class_ID, connection);

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
      `${StudentName}_${studentId}.JPG`,
      path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.JPG`),
      new Date(),
      new Date(),
      0, // Ref_Image_Update_Count
      Location_ID,
      StudentName
    ];

    // Insert the new student record into the database
    await connection.query(insertStudentQuery, insertStudentValues);

    // Define source and destination paths for image copy
    const sourcePath = path.join(Image_storage_path, Image_filename);
    const destPath = path.join(process.env.PHOTO_PASTING_PATH, `${StudentName}_${studentId}.JPG`);

    // Validate paths
    if (!sourcePath || !destPath) {
      await connection.rollback();
      return res.status(500).json({ error: "Source or destination path is invalid" });
    }

    // Copy the image file from source to destination
    await fs.promises.copyFile(sourcePath, destPath);
    console.log(`Image file copied to: ${destPath}`);

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
      Ref_Image_filename: `${StudentName}_${studentId}.JPG`,
      Ref_Image_filepath: destPath,
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

// Function to generate a unique Student_ID based on School_ID and Class_ID
async function getAutoIncrementedNumber(School_ID, Class_ID, connection) {
  try {
    // Lock the table or relevant rows to avoid race conditions
    await connection.query(
      "LOCK TABLES mam_school_students WRITE"
    );

    // Query to get the highest Student_ID that matches the given School_ID and Class_ID
    const [result] = await connection.query(
      "SELECT MAX(CAST(SUBSTRING(Student_ID, LENGTH(?) + LENGTH(?) + 1) AS UNSIGNED)) AS maxNumber FROM mam_school_students WHERE School_ID = ? AND Class_ID = ?",
      [School_ID, Class_ID, School_ID, Class_ID]
    );

    // Extract the highest number from the result
    const maxNumber = result[0].maxNumber;

    // Increment the number
    const newNumber = maxNumber ? parseInt(maxNumber) + 1 : 1;

    // Unlock the table
    await connection.query("UNLOCK TABLES");

    // Return the new Student_ID
    return `${School_ID}${Class_ID}${newNumber.toString().padStart(6, '0')}`;
  } catch (error) {
    console.error("Error fetching auto-incremented number:", error);
    throw new Error("Unable to fetch auto-incremented number");
  }
}


// Get all image records with pagination
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
        Ref_Image_filename: `${StudentName}_${Student_ID}.JPG`,
        Ref_Image_filepath: `process.env.PHOTO_PASTING_PATH/${StudentName}_${Student_ID}.JPG`,
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
exports.getClassesBySchoolName = async (req, res) => {
  try {
    const { School_Name } = req.body;  // Change from req.query to req.body

    if (!School_Name) {
      return res.status(400).json({ error: "School_Name is required" });
    }

    // Query to fetch Class_Name based on School_Name
    const [classDataResults] = await db.query(
      `SELECT Class_Name FROM mam_schools WHERE School_Name = ?`,
      [School_Name]
    );

    // Check if classes exist for the provided school name
    if (classDataResults.length === 0) {
      return res.status(404).json({ error: "No classes found for the given School_Name" });
    }

    // Send the list of Class_Name values back to the frontend
    res.status(200).json({ classes: classDataResults.map(row => row.Class_Name) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

