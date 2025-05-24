const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const {verifyToken} = require('../middlewares/authMiddleware');

// Existing routes
router.get('/conversations', verifyToken,  chatController.getUserConversations);
router.get('/conversations/:conversationId', verifyToken, chatController.getConversationMessages);
router.post('/send', verifyToken, chatController.sendMessage);
router.post('/read/:conversationId', verifyToken,  chatController.markAsRead);
router.post('/conversations', verifyToken, chatController.createConversation);
router.get('/search-users', verifyToken, chatController.searchUsers);

// Add a new route for fetching message images/
router.get('/image/:messageId', verifyToken,  chatController.getMessageImage);

module.exports = router;