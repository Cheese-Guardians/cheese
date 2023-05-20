const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

//1. 유저 생성 (회원가입)
router.post('/signup', users.postUsers);
module.exports = router;