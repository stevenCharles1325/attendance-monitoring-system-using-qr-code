const mongoose = require('mongoose');
const { Schema } = mongoose;


const timeRecordScheme = new Schema({
	teacherId: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	section: { type: String, required: true },
	strand: { type: String, required: true },
	subject: { type: String, required: true },
	timein: { type: String, required: true },
	timeout: { type: String, required: true },
});


const TimeRecord = new mongoose.model('TimeRecords', timeRecordScheme);
module.exports = TimeRecord;