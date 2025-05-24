const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const stripe = require('stripe')(process.env.PAYMENT_GATEWAY_SK);



const app = express();

app.set('View engine', 'ejs');
app.use(cors({
  origin: [
    'http://localhost:5173',
    // 'https://educair-education-management.firebaseapp.com',
    // 'https://educair-education-management.web.app'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const port = process.env.PORT || 3000;


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
  }
});



// import all the routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes')

app.use('/api', userRoutes)
app.use('/api', authRoutes)
app.use('/api', serviceRoutes)
app.use('/api', paymentRoutes)
app.use('/api', feedbackRoutes)
app.use('/api/messages', messageRoutes);

// app.use('/api/messages', messageRoutes);


app.get('/', (req, res) => {
  res.send('hackathon 2025')
})

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Setup socket handlers from controller
  chatController.setupSocket(socket, io);

  socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
  });
});

app.listen(port, () => {
  console.log(`server is running at port ${port} `)
})