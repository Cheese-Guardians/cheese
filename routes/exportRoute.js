const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/exportController');

router.get(
    "/", (req,res) =>
    {res.render("export/pdf.ejs");}
);

router.get(
    "/export", (req,res) =>
    {res.render("export/export.ejs");}
);

// 비밀번호 체크
// router.post("/check/password", diagnosisController.checkPassword);

router.get(
    "/check/password", (req,res) =>
    {res.render("export/password.ejs");}
);

module.exports = router;