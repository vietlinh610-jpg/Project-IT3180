const sql = require("mssql");
require('dotenv').config();

const config =
{
    user: process.env.DB_USER,      // Lấy user từ .env (thường là 'sa')
    password: process.env.DB_PASS,  // Lấy pass từ .env (ví dụ '123456')
    server: process.env.DB_SERVER,  // Lấy tên server từ .env
    database: process.env.DB_NAME,  // Lấy tên DB (BlueMoonDB)
    options: 
    {
        encrypt: false,             // Để false khi chạy localhost (quan trọng)
        trustServerCertificate: true // Bỏ qua lỗi chứng chỉ bảo mật
    }
};

const connectDB = async () =>
{
    try
    {
        let pool = await sql.connect(config);
        console.log("✅ Đã kết nối SQL Server thành công!");
        return pool;
    } 
    catch (err) 
    {
        console.log("❌ Lỗi kết nối Database:", err.message);
    }
};

module.exports = { connectDB, sql };
