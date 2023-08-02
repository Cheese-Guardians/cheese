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

// 간호 다이어리 통계 날짜 선택 post
exports.retrieveSelectedSymptom = async function (user_id, date1, date2) {
    try {
        const symptomCsvParams = [user_id, date1, date2];
        const results = await exportModel.getSymptomCsv(pool, symptomCsvParams);
        console.log(results);
        const csvData = results[0].map(result => `${result.symptom_name},${result.degree}`).join('\n');
        console.log(csvData);
        fs.writeFileSync('csv/symptom.csv', csvData, 'utf-8');
        console.log('Data saved to symptom.csv');
      
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedSymptomError';
    }
    return '성공';
}
 