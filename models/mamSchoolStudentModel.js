// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const MamAttendance = require('./mamAttendanceModel');

// const MamSchoolStudent = sequelize.define('mam_school_student', {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     unique: true,
//     references: {
//       model: MamAttendance,
//       key: 'id'
//     }
//   },
//   School_ID: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   Class_ID: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   Student_ID: {
//     type: DataTypes.STRING,
//     allowNull: false, 
//     primaryKey: true
//   },
//   Ref_Image_filename: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: '',
//   },
//   Ref_Image_filepath: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: '',
//   },
//   Ref_Image_Create_DateTime: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   Ref_Image_Update_DateTime: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   Ref_Image_Update_Count: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Location_ID: {
//     type: DataTypes.STRING(255),
//     allowNull: false
// },
//   StudentName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   School_Name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   Class_Name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   timestamps: false, // Disables the automatic creation of createdAt and updatedAt fields
// });

// MamSchoolStudent.addHook('beforeCreate', async (student) => {
//   try {
//     const schoolIdPart = student.School_ID.toString().padStart(6, '0').substring(0, 6);
//     const classIdPart = student.Class_ID.toString().padStart(10, '0');
//     const autoIncrementId = (await MamSchoolStudent.max('id')) + 1 || 1; // Increment ID based on max current id
//     const studentIdPart = autoIncrementId.toString().padStart(6, '0');

//     student.Student_ID = `${schoolIdPart}${classIdPart}${studentIdPart}`;
//     console.log(`Generated Student_ID: ${student.Student_ID}`);
//   } catch (error) {
//     console.error('Error generating Student_ID:', error);
//     throw error; // Re-throw the error to handle it in the create method
//   }
// });
// MamSchoolStudent.belongsTo(MamAttendance, {
//   foreignKey: 'id',
//   targetKey: 'id',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
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
    allowNull: false,
  },
  StudentName: {
    type: DataTypes.STRING,
    allowNull: false,
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
