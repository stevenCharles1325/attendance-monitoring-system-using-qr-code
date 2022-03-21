const mongoose = require('mongoose');
const { Schema } = mongoose;


const sectionsStrandsScheme = new Schema({
	name: { type: String, required: true }, // The name of strand or section
	type: { type: String, required: true } // If it is a strand or a section.
});


const SectionStrand = new mongoose.model('SectionsStrands', sectionsStrandsScheme);
module.exports = SectionStrand;