const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');         // <--- Mới
//const residentRoutes = require('./routes/residentRoutes');
const feeRoutes = require('./routes/feeRoutes');

// Thêm mới các route liên quan tới khoản thu
const khoanThuRoutes = require('./routes/khoanThuRoutes');
const thuPhiRoutes = require('./routes/thuPhiRoutes');

// Sử dụng Routes
app.use('/api/auth', authRoutes);           // <--- Mới (Đăng nhập tại /api/auth/login)
//app.use('/api/residents', residentRoutes);
app.use('/api/fees', feeRoutes);

// Thêm mới các route liên quan tới khoản thu
app.use("/api/fees", khoanThuRoutes);
app.use("/", thuPhiRoutes);

app.get('/', (req, res) => {
    res.send('API is ready!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});