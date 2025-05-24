const express = require('express');
const router = express.Router();
const { createToken, clearToken, getToken, get_session } = require('../controllers/authControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

// create token while signup, login and social
router.post('/jwt/login', createToken);
// clear the token
router.post('/jwt/logout', clearToken)
// get the cookie which saved in this server
router.get('/jwt', getToken);
router.get('/session', get_session);

// in every protected route, verify korte hbe
router.get('/protected', verifyToken, (req, res) => {
  res.send(`welcome, ${req.user.name}! You are authenticated`)
})

module.exports = router;


