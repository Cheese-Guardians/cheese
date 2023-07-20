const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/communityController');
//const { upload } = require('../middlewares/multerMiddleware');

router.get(
    "/worryList", (req,res) =>
    {res.render("community/community1.ejs");}
);
router.get(
    "/infoList", (req,res) =>
    {res.render("community/community2.ejs");}
);
router.get(
    "/write", (req,res) =>
    {res.render("community/commun_write.ejs");}
);
router.get(
    "/write/view", (req, res) => {
        res.render("community/commun_view.ejs");
    }
)
module.exports = router;