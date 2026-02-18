const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());

// ✅ Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= API ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/students', studentRoutes);

// ================= ROOT TEST ROUTE =================
app.get('/', (req, res) => {
    res.send('ST Incident Management System API is running...');
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
