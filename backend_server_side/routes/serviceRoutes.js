const express = require('express');
const router = express.Router();
const { 
  createService,
  getServices
} = require('../controllers/serviceControllers');


// create a user -> post
router.post('/services', createService);
// show all users -> get
router.get('/services', getServices);

module.exports = router;
