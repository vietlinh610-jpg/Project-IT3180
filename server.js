const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');         // <--- Mới
const residentRoutes = require('./routes/residentRoutes');
const feeRoutes = require('./routes/feeRoutes');

// Sử dụng Routes
app.use('/api/auth', authRoutes);           // <--- Mới (Đăng nhập tại /api/auth/login)
app.use('/api/residents', residentRoutes);
app.use('/api/fees', feeRoutes);

app.get('/', (req, res) => {
    res.send('API is ready!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});