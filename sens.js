// sens.js
function send_message(coin_name, nickname, phone) {
	
    // 예약자 번호, 닉네임, 코인이름
    const user_phone_number = phone;
    const user_nickname = nickname;
    const user_coin_name = coin_name;
    
    // 모듈들을 불러오기. 오류 코드는 맨 마지막에 삽입 예정
    const finErrCode = 404;
    const axios = require('axios');
    const CryptoJS = require('crypto-js');
    const date = Date.now().toString();
    
    // 환경변수로 저장했던 중요한 정보들
    const serviceId = process.env.SENS_SERVICE_ID; 
    const secretKey = process.env.SENS_SECRET_KEY;
    const accessKey = process.env.SENS_ACCESS_KEY;
    const my_number = process.env.SENS_MYNUM;
    
    // 그 외 url 관련
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
		

}

module.exports = send_message;