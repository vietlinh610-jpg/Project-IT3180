const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// Lấy danh sách hộ khẩu
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM HoKhau");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Thêm hộ khẩu
router.post("/", async (req, res) => {
    const { MaHo, ChuHo, DiaChi } = req.body;

    try {
        const pool = await getPool();
        await pool.request().query(`
            INSERT INTO HoKhau (MaHo, ChuHo, DiaChi)
            VALUES (N'${MaHo}', N'${ChuHo}', N'${DiaChi}')
        `);
        res.json({ message: "Đã thêm hộ khẩu!" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
