const mongoose = require('mongoose');
const { Schema } = mongoose;


const attendanceScheme = new Schema({
	studentNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	attendance: { type: [ Object ], required: true }
});


const AttendanceRecord = new mongoose.model('AttendanceRecords', attendanceScheme);
module.exports = AttendanceRecord;