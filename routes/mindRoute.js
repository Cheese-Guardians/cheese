const express = require('express');
const router = express.Router();
const mindController = require('../controllers/mindController');


// calendar 조회 
router.get('', mindController.getCalendar);




module.exports = router;