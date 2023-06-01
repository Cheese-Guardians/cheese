const pool = require('../main');
const reminderModel = require('../models/reminderModel');

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
    console.log("SMSInfo 시작")
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