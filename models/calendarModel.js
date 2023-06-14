//캘린더 조회
async function getSelectedCalendar(pool, selectedCalendarParams) {
  const getHospital_scheduleQuery = `
    SELECT hospital_name, TIME(booking_time) AS booking_hour
    FROM hospital_schedule
    WHERE user_id = ?
    AND calendar_id = (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ?
      AND date = ?
    );
  `;
  const getCheck_listQuery = `
    SELECT check_content, is_check
    FROM check_list
    WHERE user_id = ?
    AND calendar_id = (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ? 
      AND date = ?
    );
  `;
  const getCalendarQuery = `
    SELECT sleep_time , diary
    FROM calendar
    WHERE user_id = ?
    AND calendar_id = (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ? 
      AND date = ?
    );
  `;
  const getSymptomQuery = `
    SELECT symptom_name, onset_time, degree
    FROM symptom
    WHERE user_id = ?
    AND calendar_id = (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ? 
      AND date = ?
    );
  `;

  //병원 이름
  const [hosRows] = await pool.promise().query(getHospital_scheduleQuery, selectedCalendarParams);
  const hospital_schedule = {
    hospital_name: "",
    booking_hour: ""
  };
  if (hosRows.length > 0) {
    hospital_schedule.hospital_name = hosRows[0].hospital_name;
    hospital_schedule.booking_hour = hosRows[0].booking_hour;
  }

  //체크 사항
  const [checkRows] = await pool.promise().query(getCheck_listQuery, selectedCalendarParams);
  const check_list  = checkRows.length > 0 ? checkRows.map(row => ({ content: row.check_content, is_check: row.is_check })) : [];

  //잔 시간 //관찰 일기
  const [calendarRows] = await pool.promise().query(getCalendarQuery, selectedCalendarParams);
  const calendar =  {
    sleep_time: "",
    diary: ""
  };
  
  if (calendarRows.length > 0) {
    calendar.sleep_time = calendarRows[0].sleep_time;
    calendar.diary = calendarRows[0].diary;

  }

  //증상
  const [symptomRows] = await pool.promise().query(getSymptomQuery, selectedCalendarParams);
  const symptom_list = symptomRows.length > 0 ? symptomRows.map(row => ({ symptom_name: row.symptom_name, degree: row.degree, onset_time: row.onset_time})) : [];
  
  return {hospital_schedule, check_list, calendar, symptom_list};
}

//캘린더 저장
async function insertCalInfo(pool, deleteCalendarParams, insertCalendarParams, getCalendarIdParams, deleteHospital_scheduleParams, insertHospital_scheduleParams, user_id, check_content, is_check, symptom_text, symptom_time, symptom_range){
  let calendar_id;
  // try{
    //1. 캘린더 insert 
    const deleteCalendarQuery = `
    DELETE FROM calendar WHERE user_id = ? AND \`date\` = ?;
    `;
    const insertCalendarQuery = `
      INSERT INTO calendar (user_id, \`date\`, sleep_time, diary) VALUES (?, ?, ?, ?);
    `;
    //2. 캘린더에서 해당 id select
    const getCalendarIdQuery = `
    SELECT calendar_id FROM calendar WHERE  user_id = ? AND \`date\` = ?;
    `;
    console.log("model2");
    //3. 병원일정 insert
    const deleteHospital_scheduleQuery = `
    DELETE FROM hospital_schedule WHERE calendar_id = ? AND user_id = ?; 
    `;
    const insertHospital_scheduleQuery = `
    INSERT INTO hospital_schedule (calendar_id, user_id, hospital_name, booking_time) VALUES (?, ?, ?, ?);
    `;
    //4. map 이용해 캘린더에서 checkContent 길이만큼 쿼리 생성(delete)
    const deleteCheck_listQueries = check_content.map(() => `
    DELETE FROM check_list WHERE calendar_id = ? AND user_id = ? AND check_content = ?;
    `);

    //5. map 이용해 캘린더에서 checkContent 길이만큼 쿼리 생성(insert)
    const insertCheck_listQueries = check_content.map(() => `
    INSERT INTO check_list (calendar_id, user_id, check_content, is_check) VALUES (?, ?, ?, ?);
    `);

    //6. 증상 insert
    const deleteSymptomQueries = symptom_text.map((symptom_name) => {
      if (symptom_name == undefined || symptom_name == '')
        return null
      return `
      DELETE FROM symptom WHERE calendar_id = ? AND user_id = ? AND symptom_name = ? ; 
      `;
    });
   
    const insertSymptomQueries = symptom_text.map((symptom_name, index) => {
      if (symptom_name == undefined|| symptom_name == '')
        return null
      return `
      INSERT INTO symptom (calendar_id, user_id, symptom_name, onset_time, degree) VALUES (?, ?, ?, ?, ?);
      `;
    });
    
    
    // }catch(err){
    //   console.log(err);
    // }
  const connection = await pool.promise().getConnection();
  
  console.log("why");
  try {
      await connection.query('START TRANSACTION');
      await connection.query(deleteCalendarQuery, deleteCalendarParams);
      await connection.query(insertCalendarQuery, insertCalendarParams);
      const [calendarIDRow] =  await connection.query(getCalendarIdQuery, getCalendarIdParams);
      calendar_id = calendarIDRow[0].calendar_id;
      console.log("calId: "+calendar_id);
      //가져온 calendar id로 params 수정
      deleteHospital_scheduleParams.unshift(calendar_id);
      insertHospital_scheduleParams.unshift(calendar_id);

      await connection.query(deleteHospital_scheduleQuery, deleteHospital_scheduleParams);
      await connection.query(insertHospital_scheduleQuery, insertHospital_scheduleParams);
      //가져온 calendar id로 params 동적으로 checkcontents 파라미터 만듦(delete)
      const deleteCheck_listParams = check_content.flatMap((checkContent, index) => [
      calendar_id,
      user_id,
      checkContent,
      ]);
      //가져온 calendar id로 params 동적으로 checkcontents 파라미터 만듦(insert)
      const insertCheck_listParams = check_content.flatMap((checkContent, index) => [
      calendar_id,
      user_id,
      checkContent,
      is_check[index]
      ]);
      console.log(insertCheck_listParams);
    

      for (let i = 0; i < deleteCheck_listQueries.length; i++) {
        await connection.query(deleteCheck_listQueries[i], deleteCheck_listParams.slice(i * 3, (i + 1) * 3));
      }
      
      for (let i = 0; i < insertCheck_listQueries.length; i++) {
        await connection.query(insertCheck_listQueries[i], insertCheck_listParams.slice(i * 4, (i + 1) * 4));
      }
      
      
      //await Promise.all(deleteCheck_listQueries.map((query, index) => connection.query(query, deleteCheck_listParams.slice(index * 3, (index + 1) * 3))));
      //await Promise.all(insertCheck_listQueries.map((query, index) => connection.query(query, insertCheck_listParams.slice(index * 4, (index + 1) * 4))));

      //가져온 calendar id로 params 동적으로 Symptoms 파라미터 만듦(delete)
      const deleteSymptomParams = symptom_text.flatMap((symptom_name, index) => [
        calendar_id,
        user_id,
        symptom_name
      ]);
      //가져온 calendar id로 params 동적으로 Symptoms 파라미터 만듦(insert)
      const insertSymptomParams = symptom_text.flatMap((symptom_name, index) => {
      if (symptom_time[index] == undefined || symptom_time[index] == '')
      return [
        calendar_id,
        user_id,
        symptom_name,
        null,
        symptom_range[index]
      ];
      else 
      return [
        calendar_id,
        user_id,
        symptom_name,
        symptom_time[index],
        symptom_range[index]
      ];
    });
    console.log(deleteSymptomParams);
    console.log(insertSymptomParams);
    for (let i = 0; i < deleteSymptomQueries.length; i++) {
      const query = deleteSymptomQueries[i];
      if (query !== null) {
        await connection.query(query, deleteSymptomParams.slice(i * 3, (i + 1) * 3));
      }
    }
    
    // await Promise.all(deleteSymptomQueries.map((query, index) => {
    //   if (query==null)
    //     return;
    //   else return connection.query(query, deleteSymptomParams.slice(index * 3, (index + 1) * 3));
    //   }));
    console.log("delete완료");

    for (let i = 0; i < insertSymptomQueries.length; i++) {
      const query = insertSymptomQueries[i];
      if (query !== null) {
        await connection.query(query, insertSymptomParams.slice(i * 5, (i + 1) * 5));
      }
    }
    
    // await Promise.all(insertSymptomQueries.map((query, index) => {
    //     if (query==null)
    //       return;
    //     else return connection.query(query, insertSymptomParams.slice(index * 5, (index + 1) * 5));
    //     }));
      console.log("model");

    await connection.query('COMMIT');
  } catch (error) {
      await connection.query('ROLLBACK');
      console.log(error);
      throw error;
  } finally {
      connection.release();
  }
}
// file_memories
async function selectCalendar(pool, userId, date) {
  const selectCalendarQuery =`
  SELECT server_name, extension
  FROM file_memories
  WHERE user_id = '${userId}'
    AND calendar_id = (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = '${userId}'
        AND date = '${date}'
    )
`;
const [userRow] = await pool.promise().query(selectCalendarQuery, userId);
return userRow;
}

// 파일 업로드
async function insertFileMem(pool, insertFileMemParams) {
  try{
    //console.log(typeof(insertFileMemParams[0]));
  //const server_name = parseInt(insertFileMemParams[0]);
  const connection = await pool.promise().getConnection();
  //console.log("number "+ typeof(server_name));
  const getCalendarIdQuery = `
    SELECT calendar_id FROM calendar WHERE  user_id = '${insertFileMemParams[0]}' AND \`date\` = '${insertFileMemParams[1]}' ;
    `;
    
  const insertFileMemQuery = `INSERT INTO file_memories (user_id, calendar_id, server_name, user_name, extension)
      VALUES (?, ?, ?, ?, ?);
  `;
  

  var [calendarIDRow] =  await connection.query(getCalendarIdQuery);  
  var calendar_id;
  if (calendarIDRow && calendarIDRow.length > 0) {
    calendar_id = calendarIDRow[0].calendar_id;
    console.log("calId: " + calendar_id);
  } else {
    console.log("No calendar ID found.");
    const insertCalendarQuery = `
      INSERT INTO calendar (user_id, date) VALUES ('${insertFileMemParams[0]}' , '${insertFileMemParams[1]}' );
    `;
    await connection.query(insertCalendarQuery);
    [calendarIDRow] =  await connection.query(getCalendarIdQuery); 
    calendar_id = calendarIDRow[0].calendar_id;
    console.log("calId: " + calendar_id);

  }

  //가져온 calendar id로 params 수정
  insertFileMemParams[1] = calendar_id;    
  console.log(insertFileMemParams);
  const [insertFileRow] =  await connection.query(insertFileMemQuery, insertFileMemParams);  

  return {calendarIDRow, insertFileRow};
  }catch (error) {
      console.log(error);
  }
}

module.exports = {
  selectCalendar,
  insertFileMem,
  getSelectedCalendar,
  insertCalInfo,
}