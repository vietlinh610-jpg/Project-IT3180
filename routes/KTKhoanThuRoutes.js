const express = require("express");
const router = express.Router();
const KTKhoanThuController = require("../controllers/KTKhoanThuController");

// Route: //.../api/kt-khoanthu
router.get("/", KTKhoanThuController.kiemTraThuPhi);

// Route : //.../api/kt-khoanthu
router.post("/:id", KTKhoanThuController.xacNhanThuPhi);

module.exports = router;