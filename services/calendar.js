const { response } = require('express');
const pool = require('../main');
const calendarModel = require('../models/calendar');

exports.retrieveCalendar = async function (userId) {
    const calendarResult = await calendarModel.selectCalendar(pool, userId);
    return calendarResult;
}
exports.retrieveSelectedCalendar = async function (user_id, date) {
    try {
        const selectedCalendarParams = [user_id, user_id, date];
        const calendarDataResult = await calendarModel.getSelectedCalendar(pool, selectedCalendarParams);

        return calendarDataResult;
    } catch (err) {
        return 'retrieveSelectedCalendarError';
    }
    
}
exports.createCalendar = async function (
    user_id,
    date,
    hospital_name,
    hospital_schedule,
    check_content,
    sleep_time,
    symptom_text,
    symptom_time,
    symptom_range,
    diary_text,
    is_check
) {
  try {

    const deleteCalendarParams = [
        user_id,
        date
      ];
   
    const insertCalendarParams = [
      user_id,
      date,
      sleep_time,
      diary_text,
    ];
    if (insertCalendarParams[2] == undefined ||insertCalendarParams[2] == ''){
      insertCalendarParams[2] = null;
    }
    const getCalendarIdParams = [
        user_id,
        date
      ];

    const deleteHospital_scheduleParams = [
        user_id
      ];
    const insertHospital_scheduleParams = [
        user_id,
        hospital_name,
        hospital_schedule,
      
    ];
    console.log(Array.isArray(check_content));
    console.log(Array.isArray(is_check));
    await calendarModel.insertCalInfo(pool, deleteCalendarParams, insertCalendarParams, getCalendarIdParams, deleteHospital_scheduleParams, insertHospital_scheduleParams, user_id, check_content, is_check, symptom_text, symptom_time, symptom_range);
    console.log("aervice");
    
    return '성공';
  } catch (err) {
      return err;
  }
};


exports.createFileMem = async function (server_name, user_name, extension) {
    try {
        const insertFileMemParams = [server_name, user_name, extension];
        
        await calendarModel.insertFileMem(pool, insertFileMemParams);

        return '성공';
    } catch (err) {
        return 'createFileMemError';
    }
}
