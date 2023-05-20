const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { upload } = require('../middlewares/multer');

// calendar 조회 - 일단 파일만
router.get('/:userId', calendarController.getCalendar);

// calendar 추억보관함 파일 첨부
router.post('/upload', upload.single('file'), calendarController.postFile);

module.exports = router;