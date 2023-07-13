//캘린더 조회
async function getSelectedDiary(pool, selectedDiaryParams) {
    const getDiaryQuery = `
      SELECT diary
      FROM calendar
      WHERE user_id = ?
      AND calendar_id = (
        SELECT calendar_id
        FROM calendar
        WHERE user_id = ? 
        AND date = '2023-06-03'
      );
    `;
  //관찰 일기
    const [DiarycalendarRows] = await pool.promise().query(getDiaryQuery, selectedDiaryParams);
    const calendar =  {
      diary: ""
    };
    
    if (calendarRows.length > 0) {
      calendar.diary = DiarycalendarRows[0].diary;
    }
      
    return {calendar};
  }
  
  
  module.exports = {
    getSelectedDiary,
  }