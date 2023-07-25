const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
//const { upload } = require('../middlewares/multerMiddleware');

router.get(
    "/worryList", (req,res) =>
    {res.render("community/community1.ejs");}
);
router.get("/infoList", communityController.getList);

//내가 쓴 글 조회
router.get(
    "/write", (req,res) =>
    {res.render("community/commun_write.ejs");}
);
router.get("/write/:user_id", communityController.getMyPost);
// router.get(
//     "/write/:title/:board_id", (req, res) => {
//         res.render("community/commun_view.ejs");
//     }
// )
router.get("/write/:board_id", communityController.getCommunity);

router.get(
    "/write/view", (req, res) => {
        res.render("community/commun_view.ejs");
    }
)
// board post
router.post('/write', communityController.postBoard);
router.post("/write/:board_id", communityController.postComment);
module.exports = router;