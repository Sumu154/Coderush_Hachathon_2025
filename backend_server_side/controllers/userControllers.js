const userModel = require('../models/userModel')


const createUser = async (req, res) => {
  try{
    // //console.log('post api hitting');
    const user = req.body;

    const createdUser = await userModel.create(user);
    res.status(200).json(createdUser);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


const getUsers = async (req, res) => {
  try{
    const users = await userModel.find();
    res.status(200).json(users);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
  
}

// get users with limit -> pagination
const getUsersWithLimit = async (req, res) => {
  // //console.log('get all users');
  try{
    const { page=0, limit=8, searchQuery="" } = req.query;
    console.log(page, limit, searchQuery)

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const searchFilter = {
      user_name: { $regex: searchQuery, $options: "i" }
    }
    const totalUsers = await userModel.countDocuments(searchFilter);
    console.log(totalUsers)

    // Fetch users with pagination
    const users = await userModel.find(searchFilter).skip(pageNumber*limitNumber).limit(limitNumber);
    //console.log(users)

    res.status(200).json({ 
      users, 
      totalPages: Math.ceil(totalUsers/limitNumber) // Send total pages count
    });
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message })
  }
}


const getUserById = async (req, res) => {
  try{
    const id = req.params.id;
    // //console.log(id);
    const user = await userModel.findOne( {_id: id} );
    res.status(200).json(user);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}

// get user role
const getUserRole = async (req, res) => {
  try{
    const { user_email } = req.params;
    const user = await userModel.findOne( {user_email} );
    res.status(200).json(user.user_role);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}

// get user image
const getUserImage = async (req, res) => {
  try{
    const { user_email } = req.params;
    const user = await userModel.findOne( {user_email} );
    res.status(200).json(user.user_image);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}

// get user by email
const getUserByEmail = async (req, res) => {
  try{
    const user_email = req.params.user_email;
    // //console.log(user_email);
    const user = await userModel.findOne( {user_email} );
    res.status(200).json(user);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


//change the user_role
const updateUserRoleAdmin = async (req, res) => {
  try{
    const user_email = req.params.user_email;
    const user_role = req.body.user_role;
    const user = await userModel.findOne({ user_email });
    //console.log(user);

    user.user_role = user_role;
    await user.save();
    res.status(200).json(user);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


// update academic info
// PUT /api/users/academic/:user_email
const updateAcademicInfo = async (req, res) => {
  try {
    const user_email = req.params.user_email;
    console.log(req.body)
    const { user_uni, user_dep, user_prog, user_year } = req.body.academic_info;

    const user = await userModel.findOne({ user_email });
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    user.user_uni = user_uni;
    user.user_dep = user_dep;
    user.user_prog = user_prog;
    user.user_year = user_year;

    await user.save();

    res.status(200).json({ message: "Academic info updated", user });
  } 
  catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};


const updatePrivateInfo = async (req, res) => {
  try {
    const user_email = req.params.user_email;
    console.log(req.body)
    const { user_dob, user_phone } = req.body.private_info;

    const user = await userModel.findOne({ user_email });
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    user.user_dob = user_dob;
    user.user_phone = user_phone;
    await user.save();

    res.status(200).json({ message: "Academic info updated", user });
  } 
  catch (e) {
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
};




// total user
const getTotalUsers = async (req, res) => {
  try{
    const totalUsers = await userModel.countDocuments();
    res.status(200).json(totalUsers);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}

module.exports = { 
  createUser, 
  getUsers,
  getUsersWithLimit, 
  getUserById, 
  getUserByEmail, 
  getUserRole, 
  getUserImage,
  updateUserRoleAdmin,
  updateAcademicInfo,
  updatePrivateInfo,
  getTotalUsers
};
