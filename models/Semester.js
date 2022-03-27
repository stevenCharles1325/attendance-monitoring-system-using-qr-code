const mongoose = require('mongoose');
const { Schema } = mongoose;


const semesterScheme = new Schema({
	activeSemester: { type: Number, default: 1 }
});


const Semester = new mongoose.model('Semesters', semesterScheme);
module.exports = Semester;