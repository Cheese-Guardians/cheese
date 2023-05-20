const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
//1. 유저 생성 (회원가입)
router.post('/signup'. usersController.postUsers);
module.exports = router;