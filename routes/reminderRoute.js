const express = require('express');
const router = express.Router();
const reminder = require('../controllers/reminderController');
//const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get(
    "/", (req, res) => 
        {return res.render('reminder/reminder.ejs');}
);

module.exports = router;