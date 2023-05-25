const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { upload } = require('../middlewares/multerMiddleware');

// calendar 조회 
router.get('/:userId', calendarController.getCalendar);
// calendar post
router.post('/:userId', calendarController.postCalendar);
// calendar 추억보관함 파일 첨부
router.post('/upload', upload.single('file'), calendarController.postFile);

module.exports = router;