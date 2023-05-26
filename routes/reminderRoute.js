const express = require('express');
const router = express.Router();
const reminders = require('../controllers/reminderController');

// 화면 조회
router.get("/", (req, res) => {
    return res.render('reminder/reminder.ejs');
});

// 문자 보내기
router.post('/', reminders.sendSMS);

// 복용약 알림 추가
router.post('/medication', reminders.postMedi);

// 복용약 알림 get
router.get('/medication', reminders.getMedi);

module.exports = router;