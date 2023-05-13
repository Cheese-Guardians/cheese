const express = require('express'),
    router = express.Router(),
    calendarController = require('../controllers/calendarController');

router.post('/upload', calendarController.postFiles);

module.exports = router;
