const { connectDB, sql } = require('../config/db');

// 1. Lấy danh sách tất cả cư dân (Kèm thông tin hộ)
const getAllResidents = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT nk.*, hk.DiaChi 
            FROM nhan_khau nk 
            LEFT JOIN ho_khau hk ON nk.MaHo = hk.MaHo
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// 2. Tạo Hộ khẩu mới (Ví dụ: Căn hộ mới có người chuyển đến)
const createHousehold = async (req, res) => {
    try {
        const { DiaChi, ChuHoTen, ChuHoCMND } = req.body; // Thông tin hộ và chủ hộ
        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        try {
            // Bước 1: Tạo Hộ khẩu
            const hkResult = await transaction.request()
                .input('DiaChi', sql.NVarChar, DiaChi)
                .query('INSERT INTO ho_khau (DiaChi, SoThanhVien) OUTPUT INSERTED.MaHo VALUES (@DiaChi, 1)');
            
            const newMaHo = hkResult.recordset[0].MaHo;

            // Bước 2: Tạo Nhân khẩu (Chủ hộ)
            const nkResult = await transaction.request()
                .input('CMND', sql.VarChar, ChuHoCMND)
                .input('Ten', sql.NVarChar, ChuHoTen)
                .input('MaHo', sql.Int, newMaHo)
                .query('INSERT INTO nhan_khau (CMND, Ten, MaHo) OUTPUT INSERTED.ID VALUES (@CMND, @Ten, @MaHo)');
            
            const newID = nkResult.recordset[0].ID;

            // Bước 3: Set Chủ hộ
            await transaction.request()
                .input('MaHo', sql.Int, newMaHo)
                .input('IDChuHo', sql.Int, newID)
                .query('INSERT INTO chu_ho (MaHo, IDChuHo) VALUES (@MaHo, @IDChuHo)');

            await transaction.commit();
            res.status(201).json({ message: "Tạo hộ khẩu mới thành công!", MaHo: newMaHo });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi tạo hộ", error: err.message });
    }
};

// 3. Thêm thành viên vào hộ
const addMember = async (req, res) => {
    try {
        const { MaHo, Ten, CMND, Tuoi, QuanHe } = req.body;
        const pool = await connectDB();
        
        // Thêm nhân khẩu
        const result = await pool.request()
            .input('MaHo', sql.Int, MaHo)
            .input('Ten', sql.NVarChar, Ten)
            .input('CMND', sql.VarChar, CMND)
            .input('Tuoi', sql.Int, Tuoi)
            .query('INSERT INTO nhan_khau (MaHo, Ten, CMND, Tuoi) OUTPUT INSERTED.ID VALUES (@MaHo, @Ten, @CMND, @Tuoi)');
            
        const newID = result.recordset[0].ID;

        // Cập nhật bảng quan hệ
        await pool.request()
            .input('MaHo', sql.Int, MaHo)
            .input('IDThanhVien', sql.Int, newID)
            .input('QuanHe', sql.NVarChar, QuanHe)
            .query('INSERT INTO quan_he (MaHo, IDThanhVien, QuanHe) VALUES (@MaHo, @IDThanhVien, @QuanHe)');

        // Cập nhật số thành viên trong hộ (+1)
        await pool.request()
            .input('MaHo', sql.Int, MaHo)
            .query('UPDATE ho_khau SET SoThanhVien = SoThanhVien + 1 WHERE MaHo = @MaHo');

        res.status(201).json({ message: "Thêm thành viên thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi thêm thành viên", error: err.message });
    }
};

module.exports = { getAllResidents, createHousehold, addMember };