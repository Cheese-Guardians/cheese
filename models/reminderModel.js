async function insertMediReminder(pool, user_id, medi_reminder_time) {
    const connection = await pool.promise().getConnection();
    if (Array.isArray(medi_reminder_time)) {
      // deleteMediReminderQuery는 배열입니다
      // 여기에서 필요한 작업을 수행하세요
      const deleteMediReminderQuery = medi_reminder_time.map((time) => {
        if (time == undefined || time == '')
          return null
        return `
        DELETE FROM medication_reminder WHERE user_id = ?; 
        `;
      });
      
    const insertMediReminderQuery = medi_reminder_time.map((time) => {
        if (time == undefined || time == '')
          return null
        return `
        insert into medication_reminder (user_id, medi_reminder_time)
        values (?,?);
        `;
      });

      
        const mediReminderParams = medi_reminder_time.flatMap((time, index) => {
          if (time == undefined || time == '')
          return [
            'nothing',
            'nothing'
          ];
          else 
          return [
            user_id,
            time
          ];
        });
     try{
      for (let i = 0; i < deleteMediReminderQuery.length; i++) {
        if (deleteMediReminderQuery[i]!==null)
             await connection.query(deleteMediReminderQuery[i], user_id);
      }
      for (let i = 0; i < insertMediReminderQuery.length; i++) {
        if (insertMediReminderQuery[i]!=null)
              await connection.query(insertMediReminderQuery[i], mediReminderParams.slice(i * 2, (i + 1) * 2));
      }
      
        // await Promise.all(deleteMediReminderQuery.map((query, index) => {
        //     if (query==null)
        //       return;
        //     else return connection.query(query, user_id);
        //     }));
        //   await Promise.all(insertMediReminderQuery.map((query, index) => {
        //     if (query==null)
        //       return;
        //     else return connection.query(query, mediReminderParams.slice(index * 2, (index + 1) * 2));
            // }));
     }catch(err){
        console.log(err);
        throw err;
     }
        
      connection.release();
    } else {
      if (medi_reminder_time == undefined || medi_reminder_time == ''){

      }
      else{
        const deleteMediReminderQuery  = `
        DELETE FROM medication_reminder WHERE user_id = ?; 
        `;
        const insertMediReminderQuery  = `
        insert into medication_reminder (user_id, medi_reminder_time)
        values (?,?);`
        const mediReminderParams = [
          user_id,
          medi_reminder_time
        ];
        try{
        await pool.promise().query(deleteMediReminderQuery, user_id);
        await pool.promise().query(insertMediReminderQuery, mediReminderParams);
      }catch(err){
        console.log(err);
        throw err;
     }
        

      }
      // deleteMediReminderQuery는 배열이 아닙니다
      // 다른 작업을 수행할 수 있습니다
      
    

    }
    
   
   
    
      //return insertMediReminderRow;
}
async function deleteMedi(pool, user_id) {
  const deleteMediQuery = `
  DELETE FROM medication_reminder WHERE user_id = ?; 
  `;
  const [mediRows] = await pool.promise().query(deleteMediQuery, user_id);
  return mediRows;
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
    SELECT medication_reminder.medi_reminder_time, user.gd_phone, patient.patient_name
    FROM medication_reminder
    INNER JOIN user ON medication_reminder.user_id = user.user_id
	  INNER JOIN patient ON medication_reminder.user_id = patient.user_id
    ;
    `;
    const [phoneSMSQueryRows] = await pool.promise().query(selectSMSQuery);
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
    deleteMedi,
    selectretrievePhoneNum,
    selectSMSInfo
    // selectHospital
}
