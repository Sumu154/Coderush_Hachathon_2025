const mongoose = require('mongoose');
const connectDB = require('../config/db');

const feedbackSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  feedback_rating: {
    type: Number,
    required: true
  },
  feedback_description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
