const reminderService = require('../services/reminderService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");
const path = require('path');
const axios = require('axios');
const Cache = require('memory-cache');
const crypto = require('crypto');

exports.postMedi = async function (req, res) {
    const token = req.cookies.x_auth;
    const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화 
    const user_id = decodedToken.user_id; // user_id를 추출
    if (token) {
        const {
            medi_reminder_time
        } = req.body;
        console.log(medi_reminder_time);
        const MediResponse = await reminderService.createMediReminder(
            user_id,
            medi_reminder_time
        );
        if (MediResponse == "성공") {
            return res.status(200).send(`
              <script>
                if (confirm('알림 등록에 성공했습니다.')) {
                  window.location.href = "/reminder";
                }
              </script>
            `);
          } else {
            return res.send(`
              <script>
                if (confirm('알림 등록에 실패했습니다.')) {
                  window.location.href = "/reminder";
                }
              </script>
            `);
          }
    }
    else {
        return res.send('reminder req error(token)');
      }

    
    
};

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

// 문자 세팅

// 문자 보내기
exports.sendSMS = async function (req, res) {
    const mediSMSResult = await reminderService.SMSInfo();
    function sendSMS(phoneNumber) {
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

        try {
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
                content: `
                    <치매 가디언즈 알림>
                    복용약 드실 시간입니다.
                    `,
                messages: [
                    {
                        to: `${phoneNumber}`,
                    },
                ],
                }, 
            })
            return baseResponse.SMS_SEND_SUCCESS;
        } catch (err) {
            return baseResponse.SMS_SEND_FAILURE;
        }
    }
        // 메일을 보낼 시간에 대한 처리
        mediSMSResult.forEach((row) => {
          console.log(row);
          const time = row.medi_reminder_time; // medi_reminder_time 값
          const phoneNumber = row.gd_phone; // gd_phone 값
  
          // 현재 시간과 medi_reminder_time 값을 비교하여 SMS를 보낼 시간이라면 sendSMS 함수 호출
          const currentTime = new Date();
          const reminderTime = new Date(currentTime.toDateString() + ' ' + time);
          if (currentTime.getHours() === reminderTime.getHours() && currentTime.getMinutes() === reminderTime.getMinutes()) {
            sendSMS(phoneNumber);
            console.log("sms전송 완료!><");
          }
        });
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
