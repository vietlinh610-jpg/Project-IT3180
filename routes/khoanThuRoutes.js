const express = require("express");
const router = express.Router();
const khoanThuController = require("../controllers/khoanThuController");

router.post("/", khoanThuController.taoKhoanThu);
router.get("/", khoanThuController.layKhoanThu);

module.exports = router;