const express = require('express');
const router = express.Router();
const { 
  createService,
  getServices,
  getServicePrice
} = require('../controllers/serviceControllers');


// create a user -> post
router.post('/services', createService);
// show all users -> get
router.get('/services', getServices);
// get service_price 
router.get('/services/:service_id/service_price', getServicePrice)

module.exports = router;
