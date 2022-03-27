const mongoose = require('mongoose');
const { Schema } = mongoose;


const strandsScheme = new Schema({
	name: { type: String, required: true }, // The name of strand or section
	sections: { type: [ String ], default: [] } // If it is a strand or a section.
});


const Strand = new mongoose.model('Strands', strandsScheme);
module.exports = Strand;