const exportService = require('../services/exportService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const axios = require('axios');

exports.postSummary = async function (req, res) {
    try {
      const { user_id, date1 } = req.body;

      // date1 + 27일
      var date = new Date(date1);  // 문자열을 Date 객체로 변환
      date.setDate(date.getDate() + 27);  // 해당 날짜에 28일을 더함

      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, "0");  // 월은 0부터 시작하므로 +1을 해줌
      var day = String(date.getDate()).padStart(2, "0");

      var date2 = `${year}-${month}-${day}`;

      // service 함수 호출
      const diaryResponse = await exportService.retrieveSelectedDiary(user_id, date1, date2);
      const diaryText = diaryResponse.calendar.diary.filter(entry => entry !== null).join(' ');

      // gpt 함수 호출
      // const summary = await summarizeDiary(diaryText);
      res.json({ summary });
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to summarize diary.');
    }
  }
  
  // GPT API
  async function summarizeDiary(diaryResponse) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a diary summarizer. In Korean, please summarize it in 150 letters.' },
          { role: 'user', content: diaryResponse },
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });
  
      // 요약된 내용은 response.data.choices[0].message.content에서 확인할 수 있습니다.
      const summary = response.data.choices[0].message.content;
      console.log("\n\n결과: ",summary);
      return summary;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to summarize diary.');
    }
  }
  