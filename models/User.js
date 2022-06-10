const mongoose = require('mongoose');
const { Schema } = mongoose;


const userScheme = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	imageSrc: { type: String }
});


const User = new mongoose.model('Users', userScheme);
module.exports = User;