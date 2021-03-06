const mongoose = require('mongoose');
const { Schema } = mongoose;


const teacherRecordScheme = new Schema({
	employeeNo: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: { type: String, default: "N/A" },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, default: 'I prefer not to say' },
	birthDate: { type: String, required: true },
	section: { type: [ String ], required: true },
	strand: { type: [ String ], required: true },
	state: { type: String, default: 'unverified' },
	status: { type: String, default: 'deactivated' },
	subjects: { type: [ Object ], required: true },
});


const TeacherRecord = new mongoose.model('TeacherRecords', teacherRecordScheme);
module.exports = TeacherRecord;