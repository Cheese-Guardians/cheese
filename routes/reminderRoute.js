const express = require('express');
const router = express.Router();
const reminders = require('../controllers/reminderController');

// 화면 조회
router.get("/", (req, res) => {
    return res.render('reminder/reminder.ejs');
});

// SMS 메시지 보내기를 처리하는 라우트 핸들러
// 문자인증(SENS를 통한) 전송 API
app.post('/send', user.send);

// 문자인증(SENS를 통한) 검증 API
app.post('/verify', user.verify);
  
  module.exports = router;

// 문자 보내기
// router.post('/', reminders.sendSMS);

// 복용약 알림 추가
// router.post('/medication', reminders.postMedi);

// 복용약 알림 get
router.get('/medication', reminders.getMedi);

// 병원 일정 알림 get
// router.get('/hospital', reminders.getHospital);

module.exports = router;