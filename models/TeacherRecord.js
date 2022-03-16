const mongoose = require('mongoose');
const { Schema } = mongoose;


const teacherRecordScheme = new Schema({
	employeeNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, required: true },
	lastName: { type: String, required: true },
	birthDate: { type: String, required: true },
	password: { type: String, required: true }
});


const TeacherRecord = new mongoose.model('TeacherRecords', teacherRecordScheme);
module.exports = TeacherRecord;