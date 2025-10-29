require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");
const Message = require('./models/Message'); // Message model ko import kiya

connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

app.use(cors());
app.use(express.json());
const PORT = 3001;

let users = [];
const addUser = (userId, socketId) => { !users.some((user) => user.userId === userId) && users.push({ userId, socketId }); };
const removeUser = (socketId) => { users = users.filter((user) => user.socketId !== socketId); };
const getUser = (userId) => { return users.find((user) => user.userId === userId); };

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // --- YAHAN PAR BADLAAV KIYA GAYA HAI ---
  socket.on("sendMessage", async ({ senderId, receiverId, conversationId, text }) => {
    // Naye message ko database me save karo
    const newMessage = new Message({ conversationId, sender: senderId, text });
    try {
        const savedMessage = await newMessage.save();

        // Receiver aur sender, dono ko naya message bhejo
        const receiver = getUser(receiverId);
        if (receiver) {
          io.to(receiver.socketId).emit("getMessage", savedMessage);
        }
        const sender = getUser(senderId);
        if (sender) {
          io.to(sender.socketId).emit("getMessage", savedMessage);
        }
    } catch (err) {
        console.log("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// --- API Routes (Same as before) ---
// (Saare API routes jaise the waise hi rahenge)
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/links', require('./routes/links'));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/messages", require("./routes/messages"));


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server chal raha hai http://localhost:${PORT} par`);
});
