const { response } = require('express');
const pool = require('../main');
const reminderModel = require('../models/reminderModel');
const baseResponse = require("../config/baseResponseStatus");

exports.createMediReminder = async function (
    user_id,
    medi_reminder_time
) {
    try {
        const mediReminderResult = await reminderModel.insertMediReminder(pool, user_id, medi_reminder_time);
        //console.log(mediReminderResult[0].user_id)
        return "성공";
    } catch (err) {

        return err;
    }
}

exports.deleteMediReminder = async function (
    user_id
) {
    try {
        const mediReminderResult = await reminderModel.deleteMedi(pool, user_id);
        //console.log(mediReminderResult[0].user_id)
        return "성공";
    } catch (err) {
        console.log(err);

        return err;
    }
}

// 복용약 알림 get
exports.retrieveMedi = async function (user_id) {
    try {
        const mediResult = await reminderModel.selectMedi(pool, user_id);
        return mediResult;
    } catch (err) {
        return 'retrieveMediError';
    }
}

// 문자 보내기
exports.retrievePhoneNum = async function (user_id) {
    try {
        const phoneNumResult = await reminderModel.selectretrievePhoneNum(pool, user_id);
        return phoneNumResult;
    } catch (err) {
        return 'retrievePhoneNumError';
    }
}
// 문자 보내기
exports.SMSInfo = async function () {
    try {
        const phoneNumResult = await reminderModel.selectSMSInfo(pool);
        return phoneNumResult;
    } catch (err) {
        return 'SMSInfo';
    }
}


// 병원 일정 알림 get
/*
exports.retrieveHospital = async function (user_id) {
    try {
        const hospitalResult = await reminderModel.selectHospital(pool, user_id);
        return hospitalResult;
    } catch (err) {
        return 'retrieveHospitalError';
    }
}
*/
