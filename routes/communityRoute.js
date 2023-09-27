const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
//const { upload } = require('../middlewares/multerMiddleware');

//커뮤니티 게시판 리스트 조회
router.get("/worryList", communityController.getWorryList);
router.get("/infoList", communityController.getInfoList);

//내가 쓴 글 조회
router.get(
    "/write", communityController.getWrite
);
router.get("/write/:board_id", communityController.getCommunity);
// router.get(
//     "/write/:title/:board_id", (req, res) => {
//         res.render("community/commun_view.ejs");
//     }
// )
// router.get("/write/:board_id", communityController.getCommunity);

router.get(
    "/write/view", (req, res) => {
        res.render("community/commun_view.ejs");
    }
)
// board post
router.post('/write', communityController.postBoard);
router.post("/write/:board_id", communityController.postComment);
module.exports = router;