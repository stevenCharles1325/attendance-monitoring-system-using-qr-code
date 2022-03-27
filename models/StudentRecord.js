const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentRecordScheme = new Schema({
	studentNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	birthDate: { type: String, required: true },
	section: { type: [ String ], required: true },
	strand: { type: [ String ], required: true },
	state: { type: String, default: 'unverified' },
	status: { type: String, default: 'activated' }
});


const StudentRecord = new mongoose.model('StudentRecords', studentRecordScheme);
module.exports = StudentRecord;