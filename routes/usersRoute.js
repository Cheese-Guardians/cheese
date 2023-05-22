const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// 1. 유저 생성 (회원가입)
router.post('/signup', users.postUsers);

router.get(
    "/signup", (req,res) =>
    {res.render("users/signup");}
);

// 2. 로그인 (JWT 생성)
router.post('/login', users.login);

module.exports = router;