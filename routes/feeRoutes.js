const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

router.get('/', feeController.getAllFees);
router.post('/create', feeController.createFee);
router.post('/pay', feeController.recordPayment);
router.get('/history', feeController.getPaymentHistory); // <--- Mới thêm

module.exports = router;