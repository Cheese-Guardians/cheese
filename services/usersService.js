const { response } = require('express');
const pool = require('../main');
const usersModel = require('../models/usersModel');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");

// 회원가입
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
    address
  ) {
    try {
  
      // 비밀번호 암호화
      const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");
  
      const insertUserPhoneParams = [
        gd_phone,
        user_name
      ];
      const insertUserInfoParams = [
        user_id,
        hashedPassword,
        relationship,
        gd_phone
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
        return 'createUserError';
    }
  };

  // 아이디 확인
  exports.userIdCheck = async function (user_id) {
    const userIdCheckResult = await usersModel.selectUserId(pool, user_id);
  
    return userIdCheckResult;
  };

  // 비밀번호 확인
  exports.passwordCheck = async function (selectUserPasswordParams) {
    const passwordCheckResult = await usersModel.selectUserPassword(
        pool,
        selectUserPasswordParams
    );
    return passwordCheckResult[0];
  };

  // 이름 조회
  exports.accountCheck = async function (user_id) {
    const userAccountResult = await usersModel.selectUserAccount(pool, user_id);

    return userAccountResult;
  };

  // 로그인
  exports.postSignIn = async function (user_id, password) {
    try {
      // 아이디 여부 확인
      const userIdRows = await exports.userIdCheck(user_id);
      if (userIdRows.length < 1)
        return baseResponse.SIGNIN_EMAIL_WRONG;
  
      const selectUserId = userIdRows[0].user_id;
  
      // 비밀번호 확인
      const hashedPassword = await crypto
          .createHash("sha512")
          .update(password)
          .digest("hex");
  
      const selectUserPasswordParams = [selectUserId, hashedPassword];
      const passwordRows = await exports.passwordCheck(
        selectUserPasswordParams
      );
  
      if (passwordRows[0].password !== hashedPassword) {
          return baseResponse.SIGNIN_PASSWORD_WRONG;
      }

      // 이름 조회
      const userInfoRows = await exports.accountCheck(user_id);
  
      //토큰 생성 Service
      let token = await jwt.sign(
        {
          user_id: user_id,
          user_name: userInfoRows[0].user_name,
        }, // 토큰의 내용(payload)
        secret.jwtsecret, // 비밀키
        {
          expiresIn: "7d",
          subject: "user",
        } // 유효 기간 60분
      );

      const insertUserJWTParams = [token, user_id];
      await usersModel.insertUserJWT(pool, insertUserJWTParams);
  
      return {
        user_id: user_id,
        user_name: userInfoRows[0].user_name,
        jwt: token,
      };
    } catch (err) {
      return baseResponse.DB_ERROR;
    }
  }