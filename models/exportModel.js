
async function getSelectedDiary(pool, selectedDiaryParams) {
    const getDiaryQuery = `
    SELECT diary, DATE_FORMAT(date, '%Y-%m-%d')
    FROM calendar
    WHERE user_id = ?
    AND calendar_id = any(
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ?
      AND date BETWEEN ? AND ?
    )
    ORDER BY date ASC;
    `;
    const [DiarycalendarRows] = await pool.promise().query(getDiaryQuery, selectedDiaryParams);
    console.log(DiarycalendarRows)
    // map에 key는 날짜, value는 diary로 해보기
    const calendar = {
      diary: []
    };
  
    if (DiarycalendarRows.length > 0) {
      calendar.diary = DiarycalendarRows.map(row => row.diary);
    }
    return { calendar };
  }
  
  
  module.exports = {
    getSelectedDiary,
  }