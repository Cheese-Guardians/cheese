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
async function getSelectedCalendar(pool, date) {
    const getSelectedCalendarQuery = `
      SELECT hospital_name
      FROM hospital_schedule
      WHERE user_id = 'handakyeng'
      AND calendar_id = (
        SELECT calendar_id
        FROM calendar
        WHERE \`date\` = \'${date}\' 
        AND user_id = 'handakyeng'
      );
    `;
    const getSelectedCalendarCKLQuery = `
      SELECT check_content
      FROM check_list
      WHERE user_id = 'handakyeng'
      AND calendar_id = (
        SELECT calendar_id
        FROM calendar
        WHERE \`date\` = \'${date}\' 
        AND user_id = 'handakyeng'
      );
    `;
    const getSelectedCalendarDiaryQuery = `
      SELECT diary
      FROM calendar
      WHERE user_id = 'handakyeng'
      AND calendar_id = (
        SELECT calendar_id
        FROM calendar
        WHERE \`date\` = \'${date}\' 
        AND user_id = 'handakyeng'
      );
    `;
    //병원 이름
    const [rows] = await pool.promise().query(getSelectedCalendarQuery, date);
    const hospitalName = rows.length > 0 ? rows[0].hospital_name : "";
    //체크 사항    
    const [checkRows] = await pool.promise().query(getSelectedCalendarCKLQuery, date);
    const checkContents  = rows.length > 0 ? checkRows.map(row => row.check_content) : "";    
    //관찰 일기
    const [diaryRows] = await pool.promise().query(getSelectedCalendarDiaryQuery, date);
    const diaryContents  = rows.length > 0 ? diaryRows.map(row => row.diary) : "";
    //console.log(rows);
    //console.log("date" + date);
    console.log("hos: " + hospitalName);
    console.log("ck: " + checkContents);
    console.log("diary: " + diaryContents);
    return {hospitalName, checkContents, diaryContents};
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