const mongoose = require('mongoose');
const { Schema } = mongoose;


const tokenScheme = new Schema({
  code: { type: String, required: true } 
});


const Token = new mongoose.model('Tokens', tokenScheme);
module.exports = Token;