// const Attendance = require('../models/attendance');

// // Controller functions for CRUD operations
// exports.createAttendance = async (req, res) => {
//   try {
//     const { Student_ID, location, latitude, longitude, timestamp } = req.body;
//     const attendance = await Attendance.create({
//       Student_ID,
//       location,
//       latitude,
//       longitude,
//       timestamp
//     });
//     res.status(201).json(attendance);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.getAllAttendance = async (req, res) => {
//   try {
//     const attendances = await Attendance.findAll();
//     res.json(attendances);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.getAttendanceById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const attendance = await Attendance.findByPk(id);
//     if (!attendance) {
//       res.status(404).json({ error: 'Attendance not found' });
//     } else {
//       res.json(attendance);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.updateAttendance = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const { Student_ID, location, latitude, longitude, timestamp } = req.body;
//     const updatedAttendance = await Attendance.update({
//       Student_ID,
//       location,
//       latitude,
//       longitude,
//       timestamp
//     }, {
//       where: { id }
//     });
//     if (updatedAttendance[0] === 0) {
//       res.status(404).json({ error: 'Attendance not found' });
//     } else {
//       res.status(200).json({ message: 'Attendance updated successfully' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.deleteAttendance = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedRows = await Attendance.destroy({
//       where: { id }
//     });
//     if (deletedRows === 0) {
//       res.status(404).json({ error: 'Attendance not found' });
//     } else {
//       res.status(204).json({ message: 'Attendance deleted successfully' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
