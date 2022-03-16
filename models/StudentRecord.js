const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentRecordScheme = new Schema({
	studentNo: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, required: true },
	lastName: { type: String, required: true },
	birthDate: { type: String, required: true },
	yearSection: { type: String, required: true },
	strand: { type: String, required: true }
});


const StudentRecord = new mongoose.model('StudentRecords', studentRecordScheme);
module.exports = StudentRecord;