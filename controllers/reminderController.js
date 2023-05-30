const reminderService = require('../services/reminderService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");

// 복용약 알림 get
exports.getMedi = async function (req,res) {
    const token = req.cookies.x_auth;
    if (token) {
        const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
        const user_id = decodedToken.user_id; // user_id를 추출
        
        // validation
        if(!user_id) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (user_id <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }

        // service 호출
        const mediResult = await reminderService.retrieveMedi(user_id);
        return res.render('reminder/reminder.ejs', { mediResult : mediResult});
    }
}

// 병원 일정 알림 get
/*
exports.getHospital = async function (req, res) {
    const token = req.cookies.x_auth;
    if (token) {
        const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
        const user_id = decodedToken.user_id; // user_id를 추출
        
        // validation
        if(!user_id) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (user_id <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }

        // service 호출
        const hospitalResult = await reminderService.retrieveHospital(user_id);
        console.log(hospitalResult);
        return res.render('reminder/reminder.ejs', { hospitalResult : hospitalResult});
    }
}
*/