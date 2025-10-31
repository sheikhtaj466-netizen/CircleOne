require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");
const Message = require('./models/Message');

// Database se connect karo
connectDB();

const app = express();
const server = http.createServer(app);

// Advanced CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://circle-one-steel.vercel.app" 
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
const io = new Server(server, { cors: corsOptions });

app.use(express.json());
const PORT = process.env.PORT || 3001;

// --- Real-Time Chat Logic ---
let users = [];
const addUser = (userId, socketId) => { !users.some((u) => u.userId === userId) && users.push({ userId, socketId }); };
const removeUser = (socketId) => { users = users.filter((u) => u.socketId !== socketId); };
const getUser = (userId) => { return users.find((u) => u.userId === userId); };

io.on("connection", (socket) => {
    socket.on("addUser", (userId) => { addUser(userId, socket.id); io.emit("getUsers", users); });
    socket.on("sendMessage", async ({ senderId, receiverId, conversationId, text }) => {
        const newMessage = new Message({ conversationId, sender: senderId, text });
        try {
            const savedMessage = await newMessage.save();
            const receiver = getUser(receiverId);
            if (receiver) io.to(receiver.socketId).emit("getMessage", savedMessage);
            const sender = getUser(senderId);
            if (sender) io.to(sender.socketId).emit("getMessage", savedMessage);
        } catch (err) { console.log("Error saving/sending message:", err); }
    });
    socket.on("disconnect", () => { removeUser(socket.id); io.emit("getUsers", users); });
});

// --- API Routes ---
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth')); // Humne yeh nayi route file add ki hai
app.use('/api/notes', require('./routes/notes'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/links', require('./routes/links'));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/messages", require("./routes/messages"));

server.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});

// Unhandled Error Handling
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
