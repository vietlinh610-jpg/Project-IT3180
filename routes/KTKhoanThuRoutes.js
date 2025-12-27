const express = require("express");
const router = express.Router();
const KTKhoanThuController = require("../controllers/KTKhoanThuController");

// Route: //.../api/kt-khoanthu
router.get("/", KTKhoanThuController.kiemTraThuPhi);

// Route : //.../api/kt-khoanthu/xacnhan
router.post("/xacnhan/:id", KTKhoanThuController.xacNhanThuPhi);

// Route : //.../api/kt-khoanthu/tuchoi
router.post("/tuchoi/:id", KTKhoanThuController.tuChoiKhoanThu);

module.exports = router;