const mongoose = require('mongoose');
const { Schema } = mongoose;


const strandsScheme = new Schema({
	name: { type: String, required: true },
	sections: { type: [ String ], default: [] },
	subjects: { type: [ String ], required: true }
});


const Strand = new mongoose.model('Strands', strandsScheme);
module.exports = Strand;