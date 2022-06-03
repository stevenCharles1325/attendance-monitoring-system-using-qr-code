const mongoose = require('mongoose');
const { Schema } = mongoose;

const remarkSchema = new Schema({
	category: { type: Number, default: 0 },
	content: { type: String, default: null }
});

const studentRecordScheme = new Schema({
	studentNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	lrn: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, default: 'I prefer not to say' },
	schoolStartDate: { type: String, required: true },
	teachers: { type: [ Object ], required: true },
	birthDate: { type: String, required: true },
	section: { type: [ String ], required: true },
	strand: { type: [ String ], required: true },
	state: { type: String, default: 'unverified' },
	status: { type: String, default: 'deactivated' },
	remark: remarkSchema,
	currentAttendanceID: { type: String, default: null },
	currentSubject: { type: String, default: null },
});


const StudentRecord = new mongoose.model('StudentRecords', studentRecordScheme);
module.exports = StudentRecord;