const mongoose = require('mongoose');
const { Schema } = mongoose;


const singleAttendanceSchema = new Schema({
    id: String,
    studentNo: String,
    fullName: String,
    teacherId: String, 
    subjectId: String,
    date: String, 
    remark: String,
    status: String,
    subject: String
});

const attendanceScheme = new Schema({
	studentNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	attendance: { type: [ singleAttendanceSchema ], required: true }
});


const AttendanceRecord = new mongoose.model('AttendanceRecords', attendanceScheme);
module.exports = AttendanceRecord;