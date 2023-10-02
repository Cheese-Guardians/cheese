const calendarService = require('../services/calendarService');
const path = require('path');
const calendarDate = require('../public/js/calendar.js');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const querystring = require('querystring');
const baseResponse = require("../config/baseResponseStatus");

//캘린더 조회
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
    const calendarResult = await calendarService.retrieveCalendar(user_id, date);
    const calendarDataResult = await calendarService.retrieveSelectedCalendar(user_id, date);
    
    if (calendarResult.length > 0) {
      
      return res.render('calendar/calendar_memory.ejs', { calendarResult: calendarResult, calendarDataResult: calendarDataResult });
    } else {
      console.log(calendarDataResult);
      return res.render('calendar/calendar_memory.ejs', { calendarResult: null, calendarDataResult: calendarDataResult });
    }
    
  } else {
    return res.redirect('/mind');
  }
}

