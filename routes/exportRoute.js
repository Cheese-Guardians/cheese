const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get(
    "/", (req,res) =>
    {res.render("export/exportPdf.ejs");}
);

// gpt post
router.post('/', exportController.postSummary);

// 비밀번호 체크
// router.post("/check/password", exportController.checkPassword);

router.get(
    "/check/password", (req,res) =>
    {res.render("export/password.ejs");}
);

module.exports = router;