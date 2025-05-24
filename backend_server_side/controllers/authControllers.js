const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const createToken = (req, res) => {
  const { user_email } = req.body;
  console.log(user_email, 'token generation');
  const token = jwt.sign({user_email}, process.env.JWT_SECRET, {expiresIn: '24h'});
  res.cookie('token', token, {
   ...cookieOptions
  });
  res.send('successfully token generated');
}


// clear the cookie while logout
const clearToken = (req, res) => {
  res.clearCookie('token', {
    ...cookieOptions,
  });
  res.send('Successfully logged out and cookie removed')
}


// get the cookie
const getToken = (req, res) => {
  const token = req.cookies.token;
  if(token){
    res.send(`token received: ${token} `);
  }
  else{
    res.status(404).send('No token found');
  }
}

const get_session = async (req, res) => {
  try {
      const token = req.cookies.token; // Get the token from cookies
      // console.log(token)
      if (!token) {
          return res.status(401).json({ message: 'Not authenticated' });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ userEmail : decoded.user_email});
  } catch (error) {
      console.error('Error in get_session:', error);
      res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { createToken, clearToken, getToken, get_session };
