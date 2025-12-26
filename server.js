const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Import Routes
// * const authRoutes = require('./routes/authRoutes');
// * const residentRoutes = require('./routes/residentRoutes');
// * const feeRoutes = require('./routes/feeRoutes');

// ? 

// Thêm mới các route liên quan tới khoản thu
const khoanThuRoutes = require('./routes/khoanThuRoutes');
const thuPhiRoutes = require('./routes/thuPhiRoutes');
const ktKhoanThuRoutes = require('./routes/KTKhoanThuRoutes');

// Sử dụng Routes
// * app.use('/api/auth', authRoutes);
//app.use('/api/residents', residentRoutes);
// * app.use('/api/fees', feeRoutes);

// ?

// Module: Khoản thu
app.use("/api/khoan-thu", khoanThuRoutes);

// Module: Thu phí
app.use("/api/thu-phi", thuPhiRoutes);

// Module: Kiểm tra khoản thu và xác nhận
app.use("/api/kt-khoanthu", ktKhoanThuRoutes);

app.get('/', (req, res) => {
    res.send('API is ready!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});