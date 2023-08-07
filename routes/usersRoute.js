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

// 3. 로그아웃
router.post("/logout", jwtMiddleware, (req, res) => {
    // 쿠키를 지웁니다.
    const token = req.cookies.x_auth;
    if (token) {
      return res.cookie("x_auth", "").render('users/login.ejs', {logoutState : '성공'});
    }
    else {
      return res.redirect('/');
    }
  });

module.exports = router;