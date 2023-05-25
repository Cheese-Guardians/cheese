async function selectCalendar(pool, userId) {
  const selectCalendarQuery = `
              SELECT server_name, extension 
              FROM file_memories 
              WHERE calendar_id = ? and user_id = 'handakyeng';
               `;
const [userRow] = await pool.promise().query(selectCalendarQuery, userId);
return userRow;
}
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



// 파일 업로드
async function insertFileMem(pool, insertFileMemParams) {
  //console.log(typeof(insertFileMemParams[0]));
  //const server_name = parseInt(insertFileMemParams[0]);
  console.log("number "+ typeof(server_name));
  const insertFileMemQuery = `INSERT INTO file_memories (calendar_id, user_id, server_name, user_name, extension)
      VALUES (1, 'handakyeng', \'${insertFileMemParams[0]}\', \'${insertFileMemParams[1]}\', \'${insertFileMemParams[2]}\');
  `;
  
 pool.query(
      insertFileMemQuery, (err, results) => {
          console.log("insert test");
          if (err) {
            console.log("insert error");
            throw err;
          }
          //return insertFileMemRow;);
      }
  );

  //return insertFileMemRow;
}

module.exports = {
  selectCalendar,
  insertFileMem,
  getSelectedCalendar,
}