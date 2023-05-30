const reminderService = require('../services/reminderService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");
const path = require('path');
const axios = require('axios');
const Cache = require('memory-cache');
const crypto = require('crypto');

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





const date = Date.now().toString();
const uri = process.env.SENS_SERVICE_ID;
console.log(uri);
const secretKey = process.env.SENS_SECRET_KEY;
console.log(secretKey);
const accessKey = process.env.SENS_ACCESS_KEY;
const method = 'POST';
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const hmac = crypto.createHmac('sha256', secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.digest('base64');
const signature = hash;

exports.send = async function (req, res) {
  const phoneNumber = req.body.phoneNumber;

  Cache.del(phoneNumber);

  //인증번호 생성
  const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

  Cache.put(phoneNumber, verifyCode.toString());

  axios({
    method: method,
    json: true,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-ncp-iam-access-key': accessKey,
      'x-ncp-apigw-timestamp': date,
      'x-ncp-apigw-signature-v2': signature,
    },
    data: {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01063007753',
      content: `[Milli] 인증번호 [${verifyCode}]를 입력해주세요.`,
      messages: [
        {
          to: `${phoneNumber}`,
        },
      ],
    }, 
    })
  .then(function (res) {
    res.send(response(baseResponse.SMS_SEND_SUCCESS));
  })
  .catch((err) => {
    if(err.res == undefined){
      res.send(response(baseResponse.SMS_SEND_SUCCESS));
    }
    else res.sned(errResponse(baseResponse.SMS_SEND_FAILURE));
  });
};

exports.verify = async function (req, res) {
  const phoneNumber = req.body.phoneNumber;
  const verifyCode = req.body.verifyCode;

  const CacheData = Cache.get(phoneNumber);

  if (!CacheData) {
    return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
  } else if (CacheData !== verifyCode) {
      return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
  } else {
    Cache.del(phoneNumber);
    return res.send(response(baseResponse.SMS_VERIFY_SUCCESS));     
  }
};

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
