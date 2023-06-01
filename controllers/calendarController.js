const calendarService = require('../services/calendar');
const path = require('path');
const calendarDate = require('../public/js/calendar.js');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");

exports.getCalendar = async function (req, res) {
  const token = req.cookies.x_auth;
  if (token) {
    const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
    const user_id = decodedToken.user_id; // user_id를 추출
  
    let date = req.query.selectedYear + req.query.selectedMonth + req.query.selectedDate;
    if (!req.query.selectedYear || !req.query.selectedMonth || !req.query.selectedDate) {
      const today = new Date();
      const selectedYear = String(today.getFullYear()).padStart(4, '0');
      const selectedMonth = String(today.getMonth() + 1).padStart(2, '0');
      const selectedDate = String(today.getDate()).padStart(2, '0');
  
      
      const existingQueryString = req.query;
      
      if (Object.keys(existingQueryString).length === 0) {
        const newURL = `${req.protocol}://${req.get('host')}${req.baseUrl}?selectedYear=${selectedYear}&selectedMonth=${selectedMonth}&selectedDate=${selectedDate}`;
        return res.redirect(newURL);
      }
    }
    // validation
    if(!user_id) {
      return res.send(baseResponse.USER_USERIDX_EMPTY);
    } 
    if (user_id <= 0) {
      return res.send(baseResponse.USER_USERIDX_LENGTH);
    }
    //sconsole.log("date!"+date);
    const calendarResult = await calendarService.retrieveCalendar(user_id);
    const calendarDataResult = await calendarService.retrieveSelectedCalendar(user_id, date);
    
    if (calendarResult.length > 0) {
      //console.log(calendarResult);
  
      //console.log("controller: "+ calendarDataResult);
      //console.log(calendarResult[calendarResult.length-1].server_name + calendarResult[calendarResult.length-1].extension);
  
      return res.render('calendar/calendar.ejs', { calendarResult: calendarResult, calendarDataResult: calendarDataResult });
    } else {
      console.log(calendarDataResult);
      return res.render('calendar/calendar.ejs', { calendarResult: null, calendarDataResult: calendarDataResult });
    }
    
    // return res.send(response(baseResponse.SUCCESS, calendarResult));
  } else {
    return res.redirect('/');
  }
}

exports.postCalendar = async function (req, res) {
  if (!req.body) {
      return req.send(`
        내용이 없음
      `);
  }

  console.log(req.body);
  //return res.redirect('/calendar');
  res.send(req.body);
};

exports.postFile = async function (req, res) {
    if (!req.file) {
        return res.send(`
          <script>
            if (confirm('파일이 없습니다. 확인을 누르면 메인 페이지로 돌아갑니다.')) {
              window.location.href = "/";
            }
          </script>
        `);
    }

    // const {calendar_id, user_id} = req.body;
    const server_name = path.basename(req.file.filename, path.extname(req.file.originalname)); //서버증상
    const user_name = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const extension = path.extname(req.file.filename);
    console.log(server_name + user_name + extension);
    const attachFileResponse = await calendarService.createFileMem(
        // calendar_id,
        // user_id,
        server_name,
        user_name,
        extension
    );
    // Code for handling file upload and database query goes here
    if (attachFileResponse == "성공") {
      return res.redirect('/calendar');
    }
    else res.send(attachFileResponse);
    //return res.redirect('/calendar');
    //res.send(attachFileResponse);
  };