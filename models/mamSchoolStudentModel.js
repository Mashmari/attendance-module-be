const connection = require('../config/database');
const MamAttendance = require('./mamAttendanceModel');

// Create a new student
const createStudent = async (student) => {
  return new Promise((resolve, reject) => {
    // Generate Student_ID before insertion
    generateStudentId(student, (err, studentId) => {
      if (err) return reject(err);

      student.Student_ID = studentId;

      const sql = `
        INSERT INTO mam_school_student (School_ID, Class_ID, Student_ID, Ref_Image_filename, Ref_Image_filepath, Ref_Image_Create_DateTime, Ref_Image_Update_DateTime, Ref_Image_Update_Count, Location_ID, StudentName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(sql, [
        student.School_ID,
        student.Class_ID,
        student.Student_ID,
        student.Ref_Image_filename,
        student.Ref_Image_filepath,
        student.Ref_Image_Create_DateTime,
        student.Ref_Image_Update_DateTime,
        student.Ref_Image_Update_Count,
        student.Location_ID,
        student.StudentName
      ], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  });
};

// Generate Student_ID
const generateStudentId = (student, callback) => {
  const schoolIdPart = student.School_ID.toString().padStart(6, '0').substring(0, 6);
  const classIdPart = student.Class_ID.toString().padStart(10, '0');

  const sql = `SELECT MAX(id) AS maxId FROM mam_school_student`;
  connection.query(sql, (err, results) => {
    if (err) return callback(err);

    const autoIncrementId = (results[0].maxId || 0) + 1;
    const studentIdPart = autoIncrementId.toString().padStart(6, '0');
    const studentId = `${schoolIdPart}${classIdPart}${studentIdPart}`;
    callback(null, studentId);
  });
};

// Get a student by Student_ID
const getStudentById = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM mam_school_student WHERE Student_ID = ?';
    connection.query(sql, [studentId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Assuming Student_ID is unique
    });
  });
};

// Update a student by Student_ID
const updateStudent = async (studentId, updatedFields) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE mam_school_student
      SET ?
      WHERE Student_ID = ?
    `;
    connection.query(sql, [updatedFields, studentId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Delete a student by Student_ID
const deleteStudent = async (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM mam_school_student WHERE Student_ID = ?';
    connection.query(sql, [studentId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  generateStudentId,
};

