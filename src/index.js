require('dotenv')
const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/route');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taskManagementApp');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB()

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
