const express = require('express');
const router = express.Router();
const nhanKhauController = require('../controllers/nhanKhauController.js');

// Lấy thông tin 1 cư dân dựa theo ID của người đó
router.get('/:id', nhanKhauController.getNhanKhauById);

// Cập nhật thông tin của 1 người dựa theo ID
router.put('/:id', nhanKhauController.updateNhanKhau);

module.exports = router;