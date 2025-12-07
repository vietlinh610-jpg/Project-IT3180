const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");

// 1. Lấy danh sách Nhân Khẩu (READ ALL) - JOIN với HoKhau để lấy thông tin
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                NK.ID, NK.HoTen, NK.NgaySinh, NK.CCCD, NK.HoKhauID,
                HK.MaHo, HK.ChuHo
            FROM NhanKhau NK
            JOIN HoKhau HK ON NK.HoKhauID = HK.ID
            ORDER BY NK.ID DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi lấy danh sách nhân khẩu: " + err.message);
    }
});

// 2. Thêm Nhân Khẩu mới (CREATE)
router.post("/", async (req, res) => {
    // Lưu ý: NgaySinh phải là chuỗi 'YYYY-MM-DD'
    const { HoKhauID, HoTen, NgaySinh, CCCD } = req.body; 

    try {
        const pool = await getPool();
        await pool.request()
            .input('hoKhauId', sql.Int, HoKhauID)
            .input('hoTen', sql.NVarChar(100), HoTen)
            .input('ngaySinh', sql.Date, NgaySinh)
            .input('cccd', sql.NVarChar(20), CCCD)
            .query(`
                INSERT INTO NhanKhau (HoKhauID, HoTen, NgaySinh, CCCD)
                VALUES (@hoKhauId, @hoTen, @ngaySinh, @cccd)
            `);
        res.json({ message: "Đã thêm nhân khẩu thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi thêm nhân khẩu: " + err.message);
    }
});

// 3. Cập nhật Nhân Khẩu (UPDATE)
router.put("/:id", async (req, res) => {
    const nhanKhauID = req.params.id;
    const { HoKhauID, HoTen, NgaySinh, CCCD } = req.body;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, nhanKhauID)
            .input('hoKhauId', sql.Int, HoKhauID)
            .input('hoTen', sql.NVarChar(100), HoTen)
            .input('ngaySinh', sql.Date, NgaySinh)
            .input('cccd', sql.NVarChar(20), CCCD)
            .query(`
                UPDATE NhanKhau 
                SET HoKhauID = @hoKhauId, HoTen = @hoTen, NgaySinh = @ngaySinh, CCCD = @cccd
                WHERE ID = @id
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Nhân Khẩu để sửa." });
        }
        res.json({ message: `Đã cập nhật Nhân Khẩu có ID: ${nhanKhauID}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi cập nhật nhân khẩu: " + err.message);
    }
});

// 4. Xóa Nhân Khẩu (DELETE)
router.delete("/:id", async (req, res) => {
    const nhanKhauID = req.params.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, nhanKhauID)
            .query(`DELETE FROM NhanKhau WHERE ID = @id`);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Nhân Khẩu để xóa." });
        }
        res.json({ message: `Đã xóa Nhân Khẩu có ID: ${nhanKhauID}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi xóa nhân khẩu: " + err.message);
    }
});

module.exports = router;