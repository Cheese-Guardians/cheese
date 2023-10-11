const { response } = require('express');
const pool = require('../main');
const calendarModel = require('../models/calendarModel');

exports.retrieveCalendar = async function (userId, date) {
    const calendarResult = await calendarModel.selectCalendar(pool, userId, date);
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

exports.retrieveSelectedMindDiary = async function (user_id, date) {
  try {
      const selectedMindDiaryParams = [user_id, user_id, date];
   
      const MindDiaryDataResult = await calendarModel.getSelectedMindDiary(pool, selectedMindDiaryParams);
      // console.log(MindDiaryDataResult);
      return MindDiaryDataResult;
  } catch (err) {
      return 'retrieveSelectedMindDiaryError';
  }
  
}
exports.createCalendar = async function (
  user_id,
  date,
  //hospital_name,
  //hospital_schedule,
  check_content,
  sleep_time,
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

  /*
  const insertHospital_scheduleParams = [
      user_id,
      hospital_name,
      hospital_schedule,      
  ];
  */
  await calendarModel.insertCalInfo(pool, deleteCalendarParams, insertCalendarParams, getCalendarIdParams, user_id, check_content, is_check,  symptom_range); //insertHospital_scheduleParams 제외
  console.log("service");
  
  return '성공';
  } catch (err) {
      return err;
  }
};


exports.createFileMem = async function ( user_id, date, server_name, user_name, extension) {
    try {
        const insertFileMemParams = [ user_id, date, server_name, user_name, extension];
        console.log("dd");
        await calendarModel.insertFileMem(pool, insertFileMemParams);
        console.log("ddd");
        return '성공';
    } catch (err) {
        return 'createFileMemError';
    }
}

exports.createMindDiary = async function (
  user_id,
  date,
  keyword,
  matter,
  change,
  solution,
  compliment) {
    try {
      insertMindDiaryParams = [
        user_id,
        date,
        keyword,
        matter,
        change,
        solution,
        compliment
      ];
      // console.log(insertMindDiaryParams)
      const mindDiaryResult = await calendarModel.insertMindDiaryInfo(pool, insertMindDiaryParams);
      return "성공"
    } catch (err) {
        return err;
    }  
}