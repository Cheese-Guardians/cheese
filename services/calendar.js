const { response } = require('express');
const pool = require('../main');
const calendarModel = require('../models/calendar');

exports.retrieveCalendar = async function (userId) {
    const calendarResult = await calendarModel.selectCalendar(pool, userId);
    return calendarResult;
}
exports.retrieveSelectedCalendar = async function (date) {
    const calendarDataResult = {
        hospital_schedule: await calendarModel.getHospital_schedule(pool, date),
        booking_hour: ""
      };
    return calendarDataResult;
}
exports.createFileMem = async function (server_name, user_name, extension) {
    try {
        const insertFileMemParams = [server_name, user_name, extension];
        
        await calendarModel.insertFileMem(pool, insertFileMemParams);

        return '성공';
    } catch (err) {
        return 'error';
    }
}

