const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { upload } = require('../middlewares/multerMiddleware');

// calendar 조회 
router.get('/', calendarController.getCalendar);
// calendar post
router.post('/', calendarController.postCalendar);
// calendar 추억보관함 파일 첨부
router.post('/upload', upload.single('file'), calendarController.postFile);

module.exports = router;