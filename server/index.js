require('dotenv').config(); // Ye hamesha top par hona chahiye
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Ye middleware JSON data ko samajhne ke liye zaroori hai
app.use(express.json());

// MongoDB Atlas se connect karein
const mongoURI = process.env.MONGO_URI; // Ye .env file se aayega

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully! ✅"))
    .catch(err => console.log("MongoDB connection error: ❌", err));

// Test route (ye pehle se hai)
app.get('/', (req, res) => {
    res.send('CircleOne Server is running!');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
