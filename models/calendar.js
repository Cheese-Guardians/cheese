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
                SELECT *
                FROM hospital_schedule
                WHERE user_id = 'handakyeng'
                AND calendar_id = (
                SELECT calendar_id
                FROM calendar
                WHERE \`date\` = str_to_date(\'${date}\','%Y%M%D') 
                AND user_id = 'handakyeng'
                );
    `;
    const [dateRow] = await pool.promise().query(getSelectedCalendarQuery, date);
    return dateRow;
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