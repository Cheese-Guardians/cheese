const express = require('express');
const router = express.Router();
const reminder = require('../controllers/reminderController');
const { authenticateUser } = require('../main.js');

router.get("/", authenticateUser, (req, res) => {
    return res.render('reminder/reminder.ejs');
});

module.exports = router;