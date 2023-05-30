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