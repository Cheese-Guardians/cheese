const { response } = require('express');
const pool = require('../main');
const exportModel = require('../models/exportModel');

// 간호 다이어리 통계 날짜 선택 post
exports.retrieveSelectedDiary = async function (user_id, date1, date2) {
    try {
        const selectedDiaryParams = [user_id, user_id, date1, date2];
        const DiaryDataResult = await exportModel.getSelectedDiary(pool, selectedDiaryParams);
        return DiaryDataResult;
    } catch (err) {
        return 'retrieveSelectedDiaryError';
    }
}

exports.retrieveSelectedSymptom = async function (user_id, date1, date2) {
    try {
        const symptomCsvParams = [user_id, date1, date2];
        const results = await exportModel.getSymptomCsv(pool, symptomCsvParams);
        console.log(results);
        return results;
      
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedSymptomError';
    }
}
 
// 간호 전체 다이어리 통계 날짜 선택 post
exports.retrieveEntireSymptom = async function (user_id, date1, date2) {
    try {
        const entireSymptomCsvParams = [user_id, date1, date2];
        const results = await exportModel.getEntireSymptomCsv(pool, entireSymptomCsvParams);
        console.log(results);
        return results;
      
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedSymptomError';
    }
}