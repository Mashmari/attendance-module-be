// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../config/database');

// // const Image = sequelize.define('mam_school_student', {
// //     id: {
// //         type: DataTypes.INTEGER,
// //         autoIncrement: true,
// //         primaryKey: false,
// //       },
// //       School_ID: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //       },
// //       Class_ID: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //       },
// //       Student_ID: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         primaryKey: true,
// //       },
// //       Ref_Image_filename: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         defaultValue: '',
// //       },
// //       Ref_Image_filepath: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         defaultValue: '',
// //       },
// //       Ref_Image_Create_DateTime: {
// //         type: DataTypes.DATE,
// //         allowNull: false,
// //         defaultValue: DataTypes.NOW,
// //       },
// //       Ref_Image_Update_DateTime: {
// //         type: DataTypes.DATE,
// //         allowNull: false,
// //         defaultValue: DataTypes.NOW,
// //       },
// //       Ref_Image_Update_Count: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         defaultValue: 0,
// //       },
// //       School_Location_ID: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //       },
// //       StudentName: {
// //         type: DataTypes.STRING,
// //         allowNull: true,
// //       },
// //       Param1: {
// //         type: DataTypes.STRING,
// //         allowNull: true,
// //       },
// //       Param2: {
// //         type: DataTypes.STRING,
// //         allowNull: true,
// //       },
// //     }, {
// //       timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
// //     });

// //     MamSchoolStudentaddHook('beforeCreate', async (image) => {
// //       // Generate Student_ID
// //       const schoolIdPart = MamSchoolStudentSchool_ID.toString().padStart(6, '0').substring(0, 6);
// //       const classIdPart = MamSchoolStudentClass_ID.toString().padStart(10, '0');
// //       const autoIncrementId = (await MamSchoolStudentmax('id')) + 1 || 1; // Increment ID based on max current id
// //       const studentIdPart = autoIncrementId.toString().padStart(6, '0');
    
// //       MamSchoolStudentStudent_ID = `${schoolIdPart}${classIdPart}${studentIdPart}`;
// //     });

// // module.exports = Image;
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const MamSchoolStudent = sequelize.define('mam_school_student', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       School_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       Class_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       Student_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: false,
//       },
//       Ref_Image_filename: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: '',
//       },
//       Ref_Image_filepath: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: '',
//       },
//       Ref_Image_Create_DateTime: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       Ref_Image_Update_DateTime: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       Ref_Image_Update_Count: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0,
//       },
//       School_Location_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       StudentName: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       Param1: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       Param2: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//     }, {
//       timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
//     });

//     MamSchoolStudent.addHook('beforeCreate', async (MamSchoolStudent) => {
//       // Generate Student_ID
//       const schoolIdPart = MamSchoolStudent.School_ID.toString().padStart(6, '0').substring(0, 6);
//       const classIdPart = MamSchoolStudent.Class_ID.toString().padStart(10, '0');
//       const autoIncrementId = (await MamSchoolStudent.max('id')) + 1 || 1; // Increment ID based on max current id
//       const studentIdPart = autoIncrementId.toString().padStart(6, '0');
    
//       MamSchoolStudentStudent_ID = `${schoolIdPart}${classIdPart}${studentIdPart}`;
//     });

// module.exports = MamSchoolStudent;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MamAttendance = require('./mamAttendanceModel');

const MamSchoolStudent = sequelize.define('mam_school_student', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    references: {
      model: MamAttendance,
      key: 'id'
    }
  },
  School_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Class_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Student_ID: {
    type: DataTypes.STRING,
    allowNull: false, 
    primaryKey: true
  },
  Ref_Image_filename: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  Ref_Image_filepath: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  Ref_Image_Create_DateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Ref_Image_Update_DateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Ref_Image_Update_Count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Location_ID: {
    type: DataTypes.STRING(255),
    allowNull: false
},
  StudentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Param1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Param2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
});

MamSchoolStudent.addHook('beforeCreate', async (student) => {
  try {
    const schoolIdPart = student.School_ID.toString().padStart(6, '0').substring(0, 6);
    const classIdPart = student.Class_ID.toString().padStart(10, '0');
    const autoIncrementId = (await MamSchoolStudent.max('id')) + 1 || 1; // Increment ID based on max current id
    const studentIdPart = autoIncrementId.toString().padStart(6, '0');

    student.Student_ID = `${schoolIdPart}${classIdPart}${studentIdPart}`;
    console.log(`Generated Student_ID: ${student.Student_ID}`);
  } catch (error) {
    console.error('Error generating Student_ID:', error);
    throw error; // Re-throw the error to handle it in the create method
  }
});
MamSchoolStudent.belongsTo(MamAttendance, {
  foreignKey: 'id',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
module.exports = MamSchoolStudent;
