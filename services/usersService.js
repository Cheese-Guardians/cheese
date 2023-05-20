const { response } = require('express');
const pool = require('../main');
const usersModel = require('../models/usersModel');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const { userInfo } = require("os");
exports.createUser = async function (
    user_id,
    password,
    gd_phone,
    relationship,
    patient_name,
    user_name,
    birth_date,
    gender,
    dementia_grade,
    medicine,
    address,
  ) {
    try {
  
      // 비밀번호 암호화
      const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");
  
      const insertUserPhoneParams = [
        gd_phone,
        user_name,
      ];
      const insertUserInfoParams = [
        user_id,
        password,
        relationship,
        gd_phone,
      ];
      const insertPatientParams = [
        user_id,
        patient_name,
        birth_date,
        dementia_grade,
        medicine,
        gender,
        address
      ];
      //await calendarModel.insertFileMem(pool, insertFileMemParams);//캘린더에 있는 데베.
    const userIdResult = await usersModel.insertUserInfo(pool, insertUserPhoneParams, insertUserInfoParams, insertPatientParams);

      //const connection = await pool.getConnection(async (conn) => conn);// 유엠씨 데베 불러오기
  
    //   const userIdResult = await userDao.insertUserInfo(
    //     connection,
    //     insertUserInfoParams
    //   );
      //console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
      return '성공';
    } catch (err) {
        return 'error';
    }
  };