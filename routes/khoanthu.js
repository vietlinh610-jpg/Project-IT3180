const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");

// 1. Lấy danh sách Khoản Thu (READ ALL)
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM KhoanThu");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi lấy danh sách khoản thu: " + err.message);
    }
});

// 2. Thêm Khoản Thu mới (CREATE)
router.post("/", async (req, res) => {
    const { TenKhoanThu, SoTien } = req.body; 

    try {
        const pool = await getPool();
        await pool.request()
            .input('tenKhoanThu', sql.NVarChar(100), TenKhoanThu)
            .input('soTien', sql.Int, SoTien)
            .query(`
                INSERT INTO KhoanThu (TenKhoanThu, SoTien)
                VALUES (@tenKhoanThu, @soTien)
            `);
        res.json({ message: "Đã thêm khoản thu thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi thêm khoản thu: " + err.message);
    }
});

// 3. Cập nhật Khoản Thu (UPDATE)
router.put("/:id", async (req, res) => {
    const khoanThuID = req.params.id;
    const { TenKhoanThu, SoTien } = req.body;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, khoanThuID)
            .input('tenKhoanThu', sql.NVarChar(100), TenKhoanThu)
            .input('soTien', sql.Int, SoTien)
            .query(`
                UPDATE KhoanThu 
                SET TenKhoanThu = @tenKhoanThu, SoTien = @soTien 
                WHERE ID = @id
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Khoản Thu để sửa." });
        }
        res.json({ message: `Đã cập nhật Khoản Thu có ID: ${khoanThuID}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi cập nhật khoản thu: " + err.message);
    }
});

// 4. Xóa Khoản Thu (DELETE)
router.delete("/:id", async (req, res) => {
    const khoanThuID = req.params.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, khoanThuID)
            .query(`DELETE FROM KhoanThu WHERE ID = @id`);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Khoản Thu để xóa." });
        }
        res.json({ message: `Đã xóa Khoản Thu có ID: ${khoanThuID}` });
    } catch (err) {
        // Lưu ý: Nếu Khoản Thu này đã có Thu Phí liên kết, SQL Server sẽ báo lỗi FOREIGN KEY
        console.error(err);
        res.status(500).send("Lỗi server khi xóa khoản thu: " + err.message);
    }
});

module.exports = router;