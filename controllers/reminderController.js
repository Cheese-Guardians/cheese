const reminderService = require('../services/reminderService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const path = require('path');
exports.postMedi = async function (req, res) {
    const token = req.cookies.x_auth;
    const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
    const user_id = decodedToken.user_id; // user_id를 추출

    const {
        medi_reminder_time
    } = req.body;
    console.log(req.body);
    const MediResponse = await reminderService.createMediReminder(
        user_id,
        medi_reminder_time
    );
    
   return res.send(MediResponse);
};
