const mongoose = require('mongoose');
const { Schema } = mongoose;


const teacherSchema = new Schema({
	id: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
});


const studentSchema = new Schema({
	id: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
});


const timeRecordScheme = new Schema({
	teacher: { type: teacherSchema, required: true },
	student: { type: studentSchema, required: true },
	section: { type: String, required: true },
	strand: { type: String, required: true },
	subject: { type: String, required: true },
	timein: { type: String, required: true },
	timeout: { type: String, default: 'No Record Yet' },
});


const TimeRecord = new mongoose.model('TimeRecords', timeRecordScheme);
module.exports = TimeRecord;