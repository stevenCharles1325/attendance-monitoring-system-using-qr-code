const mongoose = require('mongoose');
const { Schema } = mongoose;


const semesterScheme = new Schema({
	activatedSemester: { type: Number, default: 1 }
});


const Semester = new mongoose.model('Semesters', semesterScheme);
module.exports = Semester;