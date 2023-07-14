const exportService = require('../services/exportService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const axios = require('axios');

exports.postSummary = async function (req, res) {
    try {
        const {
            user_id,
            date1,
            date2
        } = req.body;
        const diaryResponse = await exportService.retrieveSelectedDiary(user_id, date1, date2);
        console.log("hihihih", diaryResponse,"hihihihi")
        console.log(summarizeDiary(diaryResponse));
        
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
          { role: 'system', content: 'You are a diary summarizer.' },
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
      return summary;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to summarize diary.');
    }
  }