const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");

// 1. Lấy danh sách Thu Phí (READ ALL) - JOIN để hiển thị tên Khoản Thu và Chủ Hộ
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                TP.ID, TP.SoTienDong, TP.NgayDong,
                HK.MaHo, HK.ChuHo, 
                KT.TenKhoanThu
            FROM ThuPhi TP
            JOIN HoKhau HK ON TP.HoKhauID = HK.ID
            JOIN KhoanThu KT ON TP.KhoanThuID = KT.ID
            ORDER BY TP.NgayDong DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi lấy danh sách thu phí: " + err.message);
    }
});

// 2. Thêm Thu Phí mới (CREATE)
router.post("/", async (req, res) => {
    // HoKhauID và KhoanThuID phải là ID hợp lệ trong DB
    const { HoKhauID, KhoanThuID, SoTienDong, NgayDong } = req.body; 

    try {
        const pool = await getPool();
        await pool.request()
            .input('hoKhauId', sql.Int, HoKhauID)
            .input('khoanThuId', sql.Int, KhoanThuID)
            .input('soTienDong', sql.Int, SoTienDong)
            .input('ngayDong', sql.Date, NgayDong) 
            .query(`
                INSERT INTO ThuPhi (HoKhauID, KhoanThuID, SoTienDong, NgayDong)
                VALUES (@hoKhauId, @khoanThuId, @soTienDong, @ngayDong)
            `);
        res.json({ message: "Đã thêm khoản thu phí thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi thêm khoản thu phí. (Kiểm tra ID Hộ Khẩu và Khoản Thu có tồn tại không): " + err.message);
    }
});

// 3. Cập nhật Thu Phí (UPDATE)
router.put("/:id", async (req, res) => {
    const thuPhiID = req.params.id;
    const { HoKhauID, KhoanThuID, SoTienDong, NgayDong } = req.body;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, thuPhiID)
            .input('hoKhauId', sql.Int, HoKhauID)
            .input('khoanThuId', sql.Int, KhoanThuID)
            .input('soTienDong', sql.Int, SoTienDong)
            .input('ngayDong', sql.Date, NgayDong)
            .query(`
                UPDATE ThuPhi 
                SET HoKhauID = @hoKhauId, KhoanThuID = @khoanThuId, SoTienDong = @soTienDong, NgayDong = @ngayDong
                WHERE ID = @id
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Thu Phí để sửa." });
        }
        res.json({ message: `Đã cập nhật Thu Phí có ID: ${thuPhiID}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi cập nhật thu phí: " + err.message);
    }
});

// 4. Xóa Thu Phí (DELETE)
router.delete("/:id", async (req, res) => {
    const thuPhiID = req.params.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, thuPhiID)
            .query(`DELETE FROM ThuPhi WHERE ID = @id`);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy Thu Phí để xóa." });
        }
        res.json({ message: `Đã xóa Thu Phí có ID: ${thuPhiID}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server khi xóa thu phí: " + err.message);
    }
});

module.exports = router;