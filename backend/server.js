require('dotenv').config();
const express = require('express');
const cors = require('cors'); // CORS package ko import kiya
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

connectDB();
const app = express();
const server = http.createServer(app);

// --- YAHAN PAR AAKHRI AUR SABSE ZAROORI BADLAAV KIYA GAYA HAI ---
// Hum server ko bata rahe hain ki KISI BHI website se aane wali request ko allow karo.
app.use(cors()); 

const io = new Server(server, { cors: { origin: "*" } });
// ---------------------------------------------

app.use(express.json());
const PORT = process.env.PORT || 3001;

// API Routes...
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
// ... baaki saare routes
app.use("/api/messages", require("./routes/messages"));


server.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});
