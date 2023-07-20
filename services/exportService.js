const { response } = require('express');
const pool = require('../main');
const exportModel = require('../models/exportModel');

exports.retrieveSelectedDiary = async function (user_id, date1, date2) {
    try {
        const selectedDiaryParams = [user_id, user_id, date1, date2];
        const DiaryDataResult = await exportModel.getSelectedDiary(pool, selectedDiaryParams);
     
          
              
        return DiaryDataResult;
    } catch (err) {
        return 'retrieveSelectedDiaryError';
    }
}