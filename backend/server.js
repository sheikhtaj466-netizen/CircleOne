require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

connectDB();
const app = express();
const server = http.createServer(app);

// --- YAHAN PAR BADLAAV KIYA GAYA HAI ---
const corsOptions = {
    origin: ["http://localhost:5173", "https://circle-one-steel.vercel.app"], // Vercel URL add kiya
    methods: ["GET", "POST", "PUT", "DELETE"]
};

const io = new Server(server, { cors: corsOptions });
app.use(cors(corsOptions));
// -------------------------------------

app.use(express.json());
const PORT = 3001;

// ... (Baaki ka poora server.js code, jaise API Routes aur Socket logic, same rahega) ...

// API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
// ... baaki saare routes

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server chal raha hai http://localhost:${PORT} par`);
});
