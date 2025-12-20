const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

router.get('/', residentController.getAllResidents);
router.post('/household', residentController.createHousehold); // API tạo hộ
router.post('/add', residentController.addMember);             // API thêm người

module.exports = router;