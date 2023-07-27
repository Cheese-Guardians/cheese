const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// 간호 다이어리 통계 내보내기
router.get(
    "/", (req,res) =>
    {
        const token = req.cookies.x_auth;
        if (token) 
            res.render("export/exportPdf.ejs");
        else
            return res.redirect('/');
    }
);

// 간호 다이어리 통계 날짜 선택 post
router.post('/', exportController.postSummary);

// 비밀번호 체크
// router.post("/check/password", exportController.checkPassword);

router.get(
    "/check/password", (req,res) =>
    {res.render("export/password.ejs");}
);

module.exports = router;