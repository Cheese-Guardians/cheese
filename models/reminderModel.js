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
module.exports = {
    insertMediReminder
};