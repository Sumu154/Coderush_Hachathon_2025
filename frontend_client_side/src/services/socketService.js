import { io } from 'socket.io-client';


let socket;

export const initSocket = (userEmail) => {
    // Create socket connection
    socket = io('http://localhost:3000', {
        withCredentials: true,
    });
    
    // Connection event
    socket.on('connect', () => {
        console.log('Connected to server');
        // Authenticate with user email
        socket.emit('authenticate', userEmail);
    });
    
    // Error handling
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
    
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};