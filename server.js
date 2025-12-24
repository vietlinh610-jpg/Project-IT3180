const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Import Routes
const hokhauRoutes = require('./routes/hokhauRoutes');
const canhoRoutes = require('./routes/canhoRoutes');
const nhankhauRoutes = require('./routes/nhankhauRoutes');
const tamvangRoutes = require('./routes/tamvangRoutes');
const tamtruRoutes = require('./routes/tamtruRoutes');
const taikhoanRoutes = require('./routes/taikhoanRoutes');
// Sử dụng Routes
app.use('/api/hokhau', hokhauRoutes);
app.use('/api/canho', canhoRoutes);
app.use('/api/nhankhau', nhankhauRoutes);
app.use('/api/tamvang', tamvangRoutes);
app.use('/api/tamtru', tamtruRoutes);
app.use('/api/taikhoan', taikhoanRoutes);

app.get('/', (req, res) => {
    res.send('API is ready!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});