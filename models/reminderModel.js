// 복용약 알림 get
async function selectMedi(pool, user_id) {
    const selectMediQuery = `
        select medi_reminder_time from medication_reminder where user_id = ?;
    `;
    const [mediRows] = await pool.promise().query(selectMediQuery, user_id);
    return mediRows;
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
    // selectHospital
}