const exportService = require('../services/exportService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const axios = require('axios');
const ejs = require('ejs');
const pdf = require("html-pdf");
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 간호 다이어리 통계 날짜 선택 post
exports.postSummary = async function (req, res) {
  const token = req.cookies.x_auth;
  if (token) {
    const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
    const user_id = decodedToken.user_id; // user_id를 추출
    const { date1 } = req.body;

    const diaryBox = [];
    for (let i=0; i<=3;i++){
      var dateA = new Date(date1);  // 문자열을 Date 객체로 변환
      dateA.setDate(dateA.getDate() + i*7);  // 해당 날짜에 28일을 더함
      
      year = dateA.getFullYear();
      month = String(dateA.getMonth() + 1).padStart(2, "0");  // 월은 0부터 시작하므로 +1을 해줌
      day = String(dateA.getDate()).padStart(2, "0");
      dateAA = `${year}-${month}-${day}`;

      var dateB = new Date(date1);  // 문자열을 Date 객체로 변환
      dateB.setDate(dateB.getDate() +  ((i+1)*7-1));  // 해당 날짜에 28일을 
            
      year = dateB.getFullYear();
      month = String(dateB.getMonth() + 1).padStart(2, "0");  // 월은 0부터 시작하므로 +1을 해줌
      day = String(dateB.getDate()).padStart(2, "0");
      dateBB = `${year}-${month}-${day}`;
      console.log(dateAA,dateBB)
      //그래프 함수 호출
      const symptomResponse = await exportService.retrieveSelectedSymptom(user_id, dateAA, dateBB);
      if (symptomResponse == 'retrieveSelectedSymptomError'){
        return res.send(symptomResponse);
      }
      // gpt 함수 호출
      const diaryResponse = await exportService.retrieveSelectedDiary(user_id, dateAA, dateBB);
      const diaryText = diaryResponse.calendar.diary.filter(entry => entry !== null).join(' ');
      // summary = await summarizeDiary(diaryText);
      summary=diaryText;
      if (i!=3){
        await sleep(1000);
      }
      diaryBox.push(summary);
    }

    if (diaryBox.length > 0) {
      ejs.renderFile(path.join('./views', "export/pdf.ejs"), {diaryBox} ,(err, data) => {
        if (err) {
              res.send(err);
              console.log(err);
        } else {                     
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile("report.pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.download('report.pdf', 'report.pdf', (err) => {
                        if (err) {
                            console.error('PDF Download Error:', err);
                        }
                        //파일 삭제
                        fs.unlink('report.pdf', (err) => {
                            if (err) {
                                console.error('PDF File Deletion Error:', err);
                            }
                        });
                    });
                }
            });
        }
    });
    } else {
      return res.send(`
        <script>
          if (confirm('일기 요약에 실패했습니다.')) {
            window.location.href = "/export";
          }
        </script>
      `);
    }
  } else {
    return res.send('postSummary req error(token)');
  }
}
  
// GPT API
async function summarizeDiary(diaryResponse) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a diary summarizer. Be sure to mark the date information except for the year. In Korean, please summarize it in 150 letters. If there is no diary content, print "no content".' },
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
