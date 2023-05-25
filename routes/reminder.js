const express = require('express');
const router = express.Router();
const reminder = require('../controllers/reminderController');
//const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get(
    "/meditation", (req,res) =>
    {res.render("reminder/meditation");}
);



module.exports = router;