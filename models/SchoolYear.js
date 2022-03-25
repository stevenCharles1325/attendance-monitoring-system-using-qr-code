const mongoose = require('mongoose');
const { Schema } = mongoose;


const schoolYearScheme = new Schema({
	from: { type: Number, required: true }, // The name of strand or section
	to: { type: Number, required: true }, // The name of strand or section
	involvedSections: { type: Array, required: true } // If it is a strand or a section.
});


const SchoolYear = new mongoose.model('SchoolYears', schoolYearScheme);
module.exports = SchoolYear;