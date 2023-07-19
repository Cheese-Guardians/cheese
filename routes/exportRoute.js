const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// 간호 다이어리 통계 내보내기
router.get(
    "/", (req,res) =>
    {res.render("export/exportPdf.ejs");}
);

// 간호 다이어리 통계 PDF
router.get(
    "/pdf", (req,res) =>
    {res.render("export/pdf.ejs");}
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