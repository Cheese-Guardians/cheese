// 간호 다이어리 통계 날짜 선택 post
async function getSelectedDiary(pool, selectedDiaryParams) {
    const getDiaryQuery = `
    SELECT diary, DATE_FORMAT(date, '%Y-%m-%d')
    FROM calendar
    WHERE user_id = ?
    AND diary IS NOT NULL  -- 추가된 조건
    AND calendar_id = any(
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ?
      AND date BETWEEN ? AND ?
    )
    ORDER BY date ASC;
  `;
  
    const [DiarycalendarRows] = await pool.promise().query(getDiaryQuery, selectedDiaryParams);
    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    }
    

    function replaceTodayAndTomorrow(diary, date) {
        const todayDate = new Date(date);
        const tomorrowDate = new Date(date);
        const yesterdayDate = new Date(date);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        yesterdayDate.setDate(yesterdayDate.getDate() -1);
        const todayString = '오늘';
        const tomorrowString = '내일';
        const yesterdayString='어제';
        const formattedDate = (date) => {
          return formatDate(date.toISOString().slice(0, 10));
        };
      
        const replacedDiary = diary
          .replace(new RegExp(todayString, 'g'), formattedDate(todayDate))
          .replace(new RegExp(tomorrowString, 'g'), formattedDate(tomorrowDate))
          .replace(new RegExp(yesterdayString, 'g'), formattedDate(yesterdayDate));
        return replacedDiary;
      }
      
      DiarycalendarRows.forEach((entry) => {
        const diaryText = entry.diary; // 'diary' 필드에 해당하는 텍스트 가져오기
        const dateFormatText = entry["DATE_FORMAT(date, '%Y-%m-%d')"]; // 'DATE_FORMAT(date, '%Y-%m-%d')' 필드에 해당하는 텍스트 가져오기
        entry.diary=replaceTodayAndTomorrow(diaryText, dateFormatText)
        
      });
    
    const calendar = {
      diary: []
    };
  
    if (DiarycalendarRows.length > 0) {
      calendar.diary = DiarycalendarRows.map(row => row.diary);
    }
    return { calendar };
  }
  
  // 증상데이터를 csv로 export
async function getSymptomCsv(pool, symptomCsvParams) {
  const getSymptomCsvQuery = `
  SELECT s.symptom_name, s.degree
  FROM symptom s
  INNER JOIN calendar c ON s.calendar_id = c.calendar_id
  WHERE s.calendar_id = ANY (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ?
      AND date BETWEEN ? AND ?
  )
  ORDER BY c.date ASC ;
  `;

  const getSymptomCsvResponse = await pool.promise().query(getSymptomCsvQuery, symptomCsvParams);
  return getSymptomCsvResponse;
}

  module.exports = {
    getSelectedDiary,
    getSymptomCsv
  }