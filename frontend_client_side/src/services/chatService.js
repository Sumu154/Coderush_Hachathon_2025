const API_URL = `http://localhost:3000/api/messages`;

// Get all conversations for current user
export const getConversations = async () => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/conversations`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch conversations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

// Get messages for a specific conversation
export const getMessages = async (conversationId) => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/conversations/${conversationId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

// Send a message
export const sendMessage = async (receiver, text, conversationId = null) => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                receiver,
                text,
                conversationId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId) => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/read/${conversationId}`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to mark messages as read');
        }

        return await response.json();
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
};

// Create a new conversation
export const createConversation = async (receiver) => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                receiver
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create conversation');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};

// Search for users
export const searchUsers = async (query) => {
    try {
        const response = await fetch(`http://localhost:3000//api/messages/search-users?query=${encodeURIComponent(query)}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to search users');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Get image URL for a message - use absolute URL for images
export const getImageUrl = (messageId) => {
    return `http://localhost:3000/api/messages/image/${messageId}`;
};