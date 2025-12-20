const { connectDB, sql } = require('../config/db');

// 1. Tạo khoản thu
const createFee = async (req, res) => {
    try {
        const { TenKhoanThu, SoTien, LoaiKhoanThu } = req.body;
        const pool = await connectDB();
        await pool.request()
            .input('TenKhoanThu', sql.NVarChar, TenKhoanThu)
            .input('SoTien', sql.Float, SoTien)
            .input('LoaiKhoanThu', sql.Int, LoaiKhoanThu)
            .query('INSERT INTO khoan_thu (TenKhoanThu, SoTien, LoaiKhoanThu) VALUES (@TenKhoanThu, @SoTien, @LoaiKhoanThu)');
        res.status(201).json({ message: "Tạo khoản thu thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi", error: err.message });
    }
};

// 2. Nộp tiền
const recordPayment = async (req, res) => {
    try {
        const { MaKhoanThu, IDThanhVien } = req.body;
        const pool = await connectDB();
        await pool.request()
            .input('MaKhoanThu', sql.Int, MaKhoanThu)
            .input('IDThanhVien', sql.Int, IDThanhVien)
            .query('INSERT INTO nop_tien (MaKhoanThu, IDThanhVien, NgayThu) VALUES (@MaKhoanThu, @IDThanhVien, GETDATE())');
        res.status(201).json({ message: "Nộp tiền thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi", error: err.message });
    }
};

// 3. Lấy danh sách khoản thu
const getAllFees = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM khoan_thu');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Lỗi", error: err.message });
    }
};

// 4. (MỚI) Lấy lịch sử đóng tiền (Thống kê)
const getPaymentHistory = async (req, res) => {
    try {
        const pool = await connectDB();
        // Join 3 bảng để lấy: Tên người nộp, Tên khoản thu, Ngày nộp, Số tiền
        const query = `
            SELECT nt.IDNopTien, nk.Ten as NguoiNop, kt.TenKhoanThu, kt.SoTien, nt.NgayThu
            FROM nop_tien nt
            JOIN nhan_khau nk ON nt.IDThanhVien = nk.ID
            JOIN khoan_thu kt ON nt.MaKhoanThu = kt.MaKhoanThu
            ORDER BY nt.NgayThu DESC
        `;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy lịch sử", error: err.message });
    }
};

module.exports = { createFee, recordPayment, getAllFees, getPaymentHistory };