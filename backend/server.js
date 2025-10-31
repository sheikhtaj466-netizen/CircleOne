require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

connectDB();
const app = express();
const server = http.createServer(app);

// --- YAHAN PAR AAKHRI AUR SABSE ZAROORI BADLAAV KIYA GAYA HAI ---
// Hum server ko bata rahe hain ki KISI BHI website se aane wali request ko allow karo.
// Yeh sabse zaroori line hai aur ise sabse upar hona chahiye.
app.use(cors()); 

const io = new Server(server, {
  cors: {
    origin: "*", // Sabhi ko allow karo
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
// ---------------------------------------------

app.use(express.json());
const PORT = process.env.PORT || 3001;

// API Routes (Same as before)
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


server.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});
