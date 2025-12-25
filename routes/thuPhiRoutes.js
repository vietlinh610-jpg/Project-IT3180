const express = require("express");
const router = express.Router();
const thuPhiController = require('../controllers/thuPhiController');

router.get("/api/thu-phi/:maKhoanThu/trang-thai", thuPhiController.xemTrangThaiThuPhi);

module.exports = router;