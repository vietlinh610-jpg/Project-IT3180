const { connectDB, sql } = require('../config/db');

// Đăng nhập hệ thống
const login = async (req, res) => {
    try {
        const { Username, Passwd } = req.body;
        const pool = await connectDB();
        
        // Kiểm tra user có tồn tại không
        const result = await pool.request()
            .input('Username', sql.VarChar, Username)
            .input('Passwd', sql.VarChar, Passwd)
            .query('SELECT * FROM nguoi_dung WHERE Username = @Username AND Passwd = @Passwd');

        if (result.recordset.length > 0) {
            // Đăng nhập thành công (Thực tế nên dùng JWT token, ở đây trả về User info đơn giản)
            const user = result.recordset[0];
            res.status(200).json({ message: "Đăng nhập thành công!", user: { ID: user.ID, Username: user.Username } });
        } else {
            res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

module.exports = { login };