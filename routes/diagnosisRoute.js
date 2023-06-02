const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');

router.get(
    "/", (req,res) =>
    {res.render("diagnosis/diagnosis.ejs");}
);

router.get(
    "/export", (req,res) =>
    {res.render("diagnosis/export.ejs");}
);

// 비밀번호 체크
// router.post("/check/password", diagnosisController.checkPassword);

router.get(
    "/check/password", (req,res) =>
    {res.render("diagnosis/password.ejs");}
);

module.exports = router;