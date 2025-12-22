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

// Quản lý cư dân
const nhanKhauRoutes = require('./routes/nhanKhauRoutes');


// Sử dụng Routes
app.use('/api/auth', authRoutes);           // <--- Mới (Đăng nhập tại /api/auth/login)
app.use('/api/residents', residentRoutes);
app.use('/api/fees', feeRoutes);

// Quản lý cư dân
app.use('/api/residents', nhanKhauRoutes);

app.get('/', (req, res) => {
    res.send('API is ready!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});