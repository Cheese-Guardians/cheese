const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// 화면 조회
router.get("/", reminderController.getMedi, (req, res) => {
    return res.render('reminder/reminder.ejs');
});

// SMS 메시지 보내기를 처리하는 라우트 핸들러
// 문자인증(SENS를 통한) 전송 API
app.post('/send', reminderController.sendSMS);

// 문자 보내기
// router.post('/', reminders.sendSMS);

// 복용약 알림 추가
 router.post('/medication', reminderController.postMedi);

// 복용약 알림 get
//  router.get('/medication', reminderController.getMedi);

// 병원 일정 알림 get
// router.get('/hospital', reminders.getHospital);

module.exports = router;