const express = require("express");
const router = express.Router();
const KTKhoanThuController = require("../controllers/KTKhoanThuController");

// Route: //.../api/kt-khoanthu
router.get("/", KTKhoanThuController.kiemTraThuPhi);

module.exports = router;