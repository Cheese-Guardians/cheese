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
  
  // 전체 증상 데이터를 csv로 export
async function getSymptomCsv(pool, symptomCsvParams) {
  const getSymptomCsvQuery = `
  SELECT s.symptom_name, s.degree, DATE_FORMAT(c.date, '%Y-%m-%d') AS date
  FROM symptom s
  INNER JOIN calendar c ON s.calendar_id = c.calendar_id
  WHERE s.calendar_id = ANY (
      SELECT calendar_id
      FROM calendar
      WHERE user_id = ?
      AND date BETWEEN ? AND ?
  )
  ORDER BY s.symptom_name, c.date ASC;
    `;

  const getSymptomCsvResponse = await pool.promise().query(getSymptomCsvQuery, symptomCsvParams);
   console.log("qqqqqqqqqqqqqqqqqqq",getSymptomCsvResponse  )
  return getSymptomCsvResponse;
}

//전체 통계 csv 
async function getEntireSymptomCsv(pool, entireSymptomCsvParams) {
  const getEntireSymptomCsvQuery = `
    WITH date_ranges AS (
      SELECT
          DATE_ADD(?, INTERVAL (n - 1) * 7 DAY) AS start_date,
          DATE_ADD(?, INTERVAL (n - 1) * 7 DAY) AS end_date
      FROM (
          SELECT 1 AS n UNION ALL
          SELECT 2 UNION ALL
          SELECT 3 UNION ALL
          SELECT 4
      ) numbers
    )
    SELECT
        symptom_name,
        SUM(degree) AS total_degree,
        date_ranges.start_date
    FROM
        symptom s
    INNER JOIN
        calendar c ON s.calendar_id = c.calendar_id
    CROSS JOIN
        date_ranges
    WHERE
        c.date >= date_ranges.start_date AND c.date < date_ranges.end_date
        AND s.user_id = ?
    GROUP BY
        symptom_name, date_ranges.start_date, date_ranges.end_date
    ORDER BY
        symptom_name, date_ranges.start_date;

    `;

  const getEntireSymptomCsvResponse = await pool.promise().query(getEntireSymptomCsvQuery, entireSymptomCsvParams);
  console.log("iiiiiiiiiiiiiiiiiiii",getEntireSymptomCsvResponse)
  return getEntireSymptomCsvResponse;
}

    

  module.exports = {
    getSelectedDiary,
    getSymptomCsv,
    getEntireSymptomCsv
  }