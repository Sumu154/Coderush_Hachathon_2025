const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getUsers, 
  getUsersWithLimit,
  getUserById, 
  getUserByEmail, 
  updateUserRoleAdmin, 
  getUserRole,
  getUserImage,
  updateAcademicInfo,
  updatePrivateInfo,
  getTotalUsers
} = require('../controllers/userControllers');


// create a user -> post
router.post('/users', createUser);
// show all users -> get
router.get('/users', getUsers);
// get users with limit
router.get('/users/limited', getUsersWithLimit)


// get users by email
router.get('/users/user_email/:user_email', getUserByEmail) //ekta specific email er info
// get users by id
router.get('/users/:user_id', getUserById);

// get user role
router.get('/users/:user_email/user_role', getUserRole)
// get user image
router.get('/users/:user_email/user_image', getUserImage);
// update academic info
router.put('/users/:user_email/academic_info', updateAcademicInfo)
// update academic info
router.put('/users/:user_email/private_info', updatePrivateInfo)

// get user role
router.patch('/users/:user_email/user_role', updateUserRoleAdmin)

// get total users
router.get('/totalUsers', getTotalUsers)


module.exports = router;