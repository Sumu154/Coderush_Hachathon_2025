const mongoose = require('mongoose');
const connectDB = require('../config/db');

const serviceSchema = new mongoose.Schema({
  service_title: {type: String, required: true},
  service_category: {type: String, required: true},
  service_listing_type: {type: String, required: true},
  service_condition: {type: String, required: true},
  service_pricing_type: {type: String, required: true},
  service_visibility: {type: String, required: true},
  user_uni: {type: String, required: true},
  service_price: {type: String, required: true},
  user_phone: {type: String, required: true},  
})

module.exports = mongoose.model('Service', serviceSchema);
