async function insertMediReminder(pool, insertMediReminderParams) {
    const insertMediReminderQuery = `
    insert into medication_reminder (user_id,medi_reminder_time)
    values (?,?);
    `;
    const insertMediReminderRow = await pool.promise().query(
        insertMediReminderQuery,
        insertMediReminderParams
      );
    
      return insertMediReminderRow;
}

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

// 문자 보내기
async function selectSMSInfo(pool) {
    const selectSMSQuery = `
    SELECT medication_reminder.medi_reminder_time, user.gd_phone
    FROM medication_reminder
    INNER JOIN user ON medication_reminder.user_id = user.user_id;
    `;
    const [phoneSMSQueryRows] = await pool.promise().query(selectSMSQuery);
    console.log(phoneSMSQueryRows);
    return phoneSMSQueryRows;
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
    insertMediReminder,
    selectMedi,
    selectretrievePhoneNum,
    selectSMSInfo
    // selectHospital
}
