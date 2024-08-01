const MamSchoolStudent = require('../models/mamSchoolStudentModel');
const MamAttendance = require('../models/mamAttendanceModel');
const MamSchoolData = require('../models/mamSchoolModel');
const fs = require('fs');
const path = require('path');

// exports.createImage = async (req, res) => {
//   try {
//     const { id, StudentName } = req.body;

//     if (!id || !StudentName) {
//       return res.status(400).json({ error: 'ID and StudentName are required' });
//     }

//     // Fetch API_User_ID from MamAttendance using the provided id
//     const attendanceRecord = await MamAttendance.findByPk(id);

//     if (!attendanceRecord) {
//       return res.status(400).json({ error: "ID does not exist in mam_attendance" });
//     }

//     const { API_User_ID, Image_storage_path, Image_filename } = attendanceRecord;

//     // Fetch School_ID, Class_ID, and Location_ID from MamSchoolData using the API_User_ID
//     const schoolData = await MamSchoolData.findOne({ where: { API_User_ID } });

//     if (!schoolData) {
//       return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
//     }

//     const { School_ID, Class_ID, Location_ID, School_Name, Class_Name } = schoolData;

//     // Log the retrieved values
//     console.log(`School_ID: ${School_ID}, Class_ID: ${Class_ID}, Location_ID: ${Location_ID}, School_Name: ${School_Name}, Class_Name: ${Class_Name}`);

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
//       Ref_Image_Update_Count: 0, // Set to 0 for new records
//       Location_ID, // Use the Location_ID fetched from MamSchoolData
//       StudentName,
//       School_Name,
//       Class_Name,
//     });

//     // Generate the Student_ID
//     const studentId = `${School_ID}${Class_ID}${id}`;
//     newStudent.Student_ID = studentId;

//     // Generate the image filename
//     const imageFilename = `${StudentName}_${studentId}.JPG`;
//     newStudent.Ref_Image_filename = imageFilename;
//     newStudent.Ref_Image_filepath = path.join('C:/Users/CDOT/CIAS_DATA/ENROLL_IMG', imageFilename);

//     // Define source and destination paths for image copy
//     const sourcePath = path.join(Image_storage_path, Image_filename);
//     const destPath = newStudent.Ref_Image_filepath;

//     // Validate paths
//     if (!sourcePath || !destPath) {
//       return res.status(500).json({ error: 'Source or destination path is invalid' });
//     }

//     // Copy the image file from source to destination
//     await fs.promises.copyFile(sourcePath, destPath);
//     console.log(`Image file copied to: ${destPath}`);

//     // Save the updated student record with the generated filename and filepath
//     await newStudent.save();

//     // Update Status_Pending to 'No' in MamAttendance table
//     await MamAttendance.update(
//       { Status_Pending: 'No' },
//       { where: { id } } // Use the id to identify the record to update
//     );

//     // Send success response
//     res.status(201).json(newStudent);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };
// new1
exports.createImage = async (req, res) => {
  try {
    const { id, StudentName } = req.body;

    if (!id || !StudentName) {
      return res.status(400).json({ error: 'ID and StudentName are required' });
    }

    // Fetch the attendance record using the provided id
    const attendanceRecord = await MamAttendance.findByPk(id);

    if (!attendanceRecord) {
      return res.status(400).json({ error: "ID does not exist in mam_attendance" });
    }

    const { API_User_ID, Image_storage_path, Image_filename } = attendanceRecord;

    // Fetch School_ID, Class_ID, and Location_ID from MamSchoolData using the API_User_ID
    const schoolData = await MamSchoolData.findOne({ where: { API_User_ID } });

    if (!schoolData) {
      return res.status(400).json({ error: "API_User_ID does not exist in mam_schools" });
    }

    const { School_ID, Class_ID, Location_ID, School_Name, Class_Name } = schoolData;

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
      Location_ID, // Use the Location_ID fetched from MamSchoolData
      StudentName,
    });

    // Generate the Student_ID
    const studentId = `${School_ID}${Class_ID}${id}`;
    newStudent.Student_ID = studentId;

    // Generate the image filename
    const imageFilename = `${StudentName}_${studentId}.JPG`;
    newStudent.Ref_Image_filename = imageFilename;
    newStudent.Ref_Image_filepath = path.join('C:/Users/CDOT/CIAS_DATA/ENROLL_IMG', imageFilename);

    // Define source and destination paths for image copy
    const sourcePath = path.join(Image_storage_path, Image_filename);
    const destPath = newStudent.Ref_Image_filepath;

    // Validate paths
    if (!sourcePath || !destPath) {
      return res.status(500).json({ error: 'Source or destination path is invalid' });
    }

    // Copy the image file from source to destination
    await fs.promises.copyFile(sourcePath, destPath);
    console.log(`Image file copied to: ${destPath}`);

    // Save the updated student record with the generated filename and filepath
    await newStudent.save();

    // Update Status_Pending to 'No' in MamAttendance table
    await MamAttendance.update(
      { Status_Pending: 'No' },
      { where: { id } } // Use the id to identify the record to update
    );

    // Send success response with School_Name and Class_Name included
    res.status(201).json({
      ...newStudent.toJSON(),
      School_Name,
      Class_Name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



// Get all image records with pagination

exports.getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Fetch all image records with pagination
    const { count, rows } = await MamSchoolStudent.findAndCountAll({
      offset,
      limit,
    });

    // Fetch School_Name and Class_Name for each record
    const imagesWithNames = await Promise.all(
      rows.map(async (image) => {
        const schoolData = await MamSchoolData.findOne({
          where: {
            School_ID: image.School_ID,
            Class_ID: image.Class_ID,
          },
          attributes: ['School_Name', 'Class_Name'],
        });

        return {
          ...image.toJSON(),
          School_Name: schoolData ? schoolData.School_Name : null,
          Class_Name: schoolData ? schoolData.Class_Name : null,
        };
      })
    );

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      images: imagesWithNames,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
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
      School_Name,
      Class_Name,
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
      image. School_Name =  School_Name;
      image.Class_Name = Class_Name;

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

