const mongoose = require('mongoose');
const connectDB = require('../config/db');

const userSchema = new mongoose.Schema({
  user_email: {type: String, required: true},
  user_name: {type: String, required: true},
  user_image: {type: String, required: true},
  user_role: {type: String, required: true},
  user_uni: {type: String, required: false},
  user_dep: {type: String, required: false},
  user_prog: {type: String, required: false},
  user_year: {type: String, required: false},
  user_phone: {type: String, required: false},
  user_dob: {type: String, required: false},
  
})

module.exports = mongoose.model('User', userSchema);
