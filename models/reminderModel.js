// 복용약 알림 get
async function selectMedi(pool, user_id) {
    const selectMediQuery = `
        select medi_reminder_time from medication_reminder where user_id = ?;
    `;
    const [mediRows] = await pool.promise().query(selectMediQuery, user_id);
    return mediRows;
}

// 문자 보내기
async function selectretrievePhoneNum(pool, user_id) {
    const selectretrievePhoneNumQuery = `
        select gd_phone from user where user_id = ?;
    `;
    const [phoneNumQueryRows] = await pool.promise().query(selectretrievePhoneNumQuery, user_id);
    return phoneNumQueryRows;
}

// 병원 일정 알림 get
/*
async function selectHospital(pool, user_id) {
    const selectHospitalQuery = `
        select medi_reminder_time from medication_reminder where user_id = ?;
    `;
    const [mediRows] = await pool.promise().query(selectHospitalQuery, user_id);
    return mediRows;
}
*/

module.exports = {
    selectMedi,
    selectretrievePhoneNum,
    // selectHospital
}