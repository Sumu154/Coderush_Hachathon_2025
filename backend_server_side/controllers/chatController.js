const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const User_Demo = require('../models/userModel');
const multer = require('multer');
const path = require('path');

// Store connected users (now using email as key)
const connectedUsers = new Map();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Setup socket connection for a user
const setupSocket = (socket, io) => {
    // Authenticate user from session
    socket.on('authenticate', async (userEmail) => {
        // Associate socket id with user email
        connectedUsers.set(userEmail, socket.id);

        // Join rooms for all user's conversations
        const conversations = await Conversation.find({
            participants: userEmail
        });

        conversations.forEach(conv => {
            socket.join(conv._id.toString());
        });

        // Broadcast user's online status
        io.emit('user_status', { userEmail, status: 'online' });

        console.log(`User ${userEmail} authenticated with socket ${socket.id}`);
    });

    // Handle new message with image support
    socket.on('send_message', async (messageData) => {
        try {
            const { sender, receiver, text, conversationId, image } = messageData;

            // If no conversation ID, create a new conversation
            let convId = conversationId;
            if (!convId) {
                const newConv = new Conversation({
                    participants: [sender, receiver],
                    lastMessage: image ? '📷 Image' : text,
                    lastMessageTimestamp: new Date(),
                    unreadCount: new Map([[receiver, 1]])
                });

                const savedConv = await newConv.save();
                convId = savedConv._id;

                // Join the room
                socket.join(convId.toString());

                // If receiver is online, add them to the room
                const receiverSocketId = connectedUsers.get(receiver);
                if (receiverSocketId) {
                    io.sockets.sockets.get(receiverSocketId)?.join(convId.toString());
                }
            } else {
                // Update existing conversation
                await Conversation.findByIdAndUpdate(convId, {
                    lastMessage: image ? '📷 Image' : text,
                    lastMessageTimestamp: new Date(),
                    $inc: { [`unreadCount.${receiver}`]: 1 }
                });
            }

            // Create new message
            const message = new Message({
                conversationId: convId,
                sender,
                receiver,
                text: text || '',
                hasImage: !!image,
                timestamp: new Date(),
                read: false
            });

            // If there's an image, add it to the message
            if (image) {
                message.image = {
                    data: Buffer.from(image.data, 'base64'),
                    contentType: image.contentType,
                    originalName: image.fileName
                };
            }

            const savedMessage = await message.save();

            // Create a modified version of the message to send to clients
            const messageForClient = {
                ...savedMessage.toObject(),
                _id: savedMessage._id,
                conversationId: convId
            };

            // If there's an image, replace the data with a URL
            if (savedMessage.hasImage) {
                const host = socket.request.headers.host || 'localhost:5000';
                const protocol = socket.request.headers['x-forwarded-proto'] || 'http';

                messageForClient.image = {
                    url: `${protocol}://${host}/api/messages/image/${savedMessage._id}`,
                    contentType: savedMessage.image.contentType,
                    originalName: savedMessage.image.originalName
                };
                delete messageForClient.image.data;
            }

            console.log('Sending message to clients:', {
                id: messageForClient._id,
                hasImage: messageForClient.hasImage,
                imageUrl: messageForClient.hasImage ? messageForClient.image.url : null
            });

            // Broadcast to the conversation room
            io.to(convId.toString()).emit('new_message', messageForClient);

            // Send notification to receiver if online
            const receiverSocketId = connectedUsers.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('message_notification', {
                    conversationId: convId,
                    message: messageForClient,
                    sender
                });
            }

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicator
    socket.on('typing', ({ conversationId, userEmail, isTyping }) => {
        socket.to(conversationId).emit('user_typing', { userEmail, isTyping });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        // Find and remove user from connectedUsers
        for (const [userEmail, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userEmail);
                io.emit('user_status', { userEmail, status: 'offline' });
                break;
            }
        }
    });
};

// Get all conversations for a user
const getUserConversations = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.user_email || decoded.email; // Support both field names

        if (!userEmail) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const conversations = await Conversation.find({
            participants: userEmail
        }).sort({ lastMessageTimestamp: -1 });

        // Get the other participant for each conversation
        const conversationsWithDetails = await Promise.all(conversations.map(async conv => {
            const otherParticipant = conv.participants.find(p => p !== userEmail);

            // Get unread count for current user
            const unreadCount = conv.unreadCount.get(userEmail) || 0;

            // Check if other user is online
            const isOnline = connectedUsers.has(otherParticipant);

            // Get other participant's display name (you might want to fetch from User model)
            const otherUser = await User_Demo.findOne({ email: otherParticipant }).select('username email');
            const displayName = otherUser ? otherUser.username : otherParticipant;

            return {
                id: conv._id,
                otherParticipant,
                otherParticipantName: displayName,
                lastMessage: conv.lastMessage,
                timestamp: conv.lastMessageTimestamp,
                unread: unreadCount,
                online: isOnline
            };
        }));

        res.json(conversationsWithDetails);

    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.user_email || decoded.email;

        if (!userEmail) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Check if user is part of this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userEmail)) {
            return res.status(403).json({ message: 'Access denied to this conversation' });
        }

        // Get messages
        const messages = await Message.find({ conversationId })
            .sort({ timestamp: 1 });

        // Format messages for client
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol || 'http';

        const formattedMessages = messages.map(msg => {
            const formattedMsg = {
                id: msg._id,
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp,
                read: msg.read,
                hasImage: msg.hasImage
            };

            if (msg.hasImage) {
                formattedMsg.image = {
                    url: `${protocol}://${host}/api/messages/image/${msg._id}`,
                    contentType: msg.image.contentType,
                    originalName: msg.image.originalName
                };
            }

            return formattedMsg;
        });

        res.json(formattedMessages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    try {
        const { receiver, text, conversationId, image } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const sender = decoded.user_email || decoded.email;

        if (!sender) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        let convId = conversationId;

        // Check if a conversation already exists
        if (!convId) {
            const existingConv = await Conversation.findOne({
                participants: { $all: [sender, receiver] },
            });

            if (existingConv) {
                convId = existingConv._id;
            } else {
                // Create a new conversation if none exists
                const newConv = new Conversation({
                    participants: [sender, receiver],
                    lastMessage: image ? '📷 Image' : text,
                    lastMessageTimestamp: new Date(),
                    unreadCount: new Map([[receiver, 1]]),
                });

                const savedConv = await newConv.save();
                convId = savedConv._id;
            }
        }

        // Create the new message
        const message = new Message({
            conversationId: convId,
            sender,
            receiver,
            text,
            timestamp: new Date(),
            read: false,
            hasImage: !!image,
        });

        if (image) {
            message.image = {
                data: Buffer.from(image.data, 'base64'),
                contentType: image.contentType,
                originalName: image.fileName,
            };
        }

        const savedMessage = await message.save();

        // Always update the conversation after saving the message
        await Conversation.findByIdAndUpdate(
            convId,
            {
                lastMessage: image ? '📷 Image' : text,
                lastMessageTimestamp: new Date(),
                $inc: { [`unreadCount.${receiver}`]: 1 }
            }
        );

        res.status(201).json({
            message: savedMessage,
            conversationId: convId,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark messages as read
const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.user_email || decoded.email;

        if (!userEmail) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Mark all messages as read where user is the receiver
        await Message.updateMany(
            {
                conversationId,
                receiver: userEmail,
                read: false
            },
            { read: true }
        );

        // Reset unread count
        await Conversation.findByIdAndUpdate(
            conversationId,
            { $set: { [`unreadCount.${userEmail}`]: 0 } }
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new conversation
const createConversation = async (req, res) => {
    try {
        const { receiver } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const sender = decoded.user_email || decoded.email;

        if (!sender) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Check if conversation already exists
        const existingConv = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        if (existingConv) {
            return res.json({ conversationId: existingConv._id });
        }

        // Create new conversation
        const newConv = new Conversation({
            participants: [sender, receiver],
            lastMessage: '',
            lastMessageTimestamp: new Date(),
            unreadCount: new Map()
        });

        const savedConv = await newConv.save();

        res.status(201).json({ conversationId: savedConv._id });

    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search for users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUserEmail = decoded.user_email || decoded.email;

        if (!currentUserEmail) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!query || query.trim() === '') {
            return res.json([]);
        }

        // Search for users by email or username
        // Exclude the current user from results
        const users = await User_Demo.find({
            $and: [
                {
                    $or: [
                        { email: { $regex: query, $options: 'i' } },
                        { username: { $regex: query, $options: 'i' } }
                    ]
                },
                { email: { $ne: currentUserEmail } } // Exclude current user
            ]
        }).select('username email').limit(10);

        // Format and return the users
        const formattedUsers = users.map(user => ({
            email: user.email,
            username: user.username,
            displayName: user.username || user.email,
            // Get online status from connected users map
            online: connectedUsers.has(user.email)
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get image content
const getMessageImage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify the token and get user_email
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.user_email || decoded.email;

        if (!userEmail) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        console.log(`Fetching image for message ${messageId} by user ${userEmail}`);

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
            console.error('Message not found:', messageId);
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user is part of this conversation
        const conversation = await Conversation.findById(message.conversationId);
        if (!conversation) {
            console.error('Conversation not found for message:', messageId);
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(userEmail)) {
            console.error('Access denied to image for user', userEmail);
            return res.status(403).json({ message: 'Access denied to this image' });
        }

        // Check if message has an image
        if (!message.hasImage || !message.image || !message.image.data) {
            console.error('No image data found for message:', messageId);
            return res.status(404).json({ message: 'No image found' });
        }

        // Set content type and send image data
        console.log('Serving image of type:', message.image.contentType);

        res.set('Content-Type', message.image.contentType);
        res.set('Cache-Control', 'public, max-age=31557600'); // Cache for a year
        return res.send(message.image.data);

    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    setupSocket,
    getUserConversations,
    getConversationMessages,
    sendMessage,
    markAsRead,
    createConversation,
    searchUsers,
    getMessageImage
};