const exportService = require('../services/exportService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const axios = require('axios');
const ejs = require('ejs');
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

    if (!date1) {
      return res.send(`
        <script>
          if (confirm('날짜를 선택해주세요.')) {
            window.location.href = "/export";
          }
        </script>
      `);
    }


    const diaryBox = [];
    for (let i = 0; i <= 3; i++) {
      var dateA = new Date(date1);  // 문자열을 Date 객체로 변환
      dateA.setDate(dateA.getDate() + i * 7);  // 해당 날짜에 28일을 더함
    
      year = dateA.getFullYear();
      month = String(dateA.getMonth() + 1).padStart(2, "0");  // 월은 0부터 시작하므로 +1을 해줌
      day = String(dateA.getDate()).padStart(2, "0");
      dateAA = `${year}-${month}-${day}`;
    
      var dateB = new Date(date1);  // 문자열을 Date 객체로 변환
      dateB.setDate(dateB.getDate() + ((i + 1) * 7 - 1));  // 해당 날짜에 28일을 더함
    
      year = dateB.getFullYear();
      month = String(dateB.getMonth() + 1).padStart(2, "0");  // 월은 0부터 시작하므로 +1을 해줌
      day = String(dateB.getDate()).padStart(2, "0");
      dateBB = `${year}-${month}-${day}`;
     // console.log(dateAA, dateBB)
    
      // 날짜 범위별로 데이터를 담는 작업
      const dateRangeText = `${dateAA}~${dateBB}`;
    
      // gpt 함수 호출
      const diaryResponse = await exportService.retrieveSelectedDiary(user_id, dateAA, dateBB);
      const diaryText = diaryResponse.calendar.diary.filter(entry => entry !== null).join(' ');
      // summary = await summarizeDiary(diaryText);
      summary = diaryText;
      if (i != 3) {
        await sleep(1000);
      }
    
      // 날짜 범위별로 데이터를 담음
      diaryBox.push({ dateRange: dateRangeText, summary });
    }

    // 그래프 함수 호출
      var standardDate = new Date(date1);
      var date7DaysLater = new Date(date1);
      var date28DaysBefore = new Date(date1);
      var date21DaysBefore = new Date(date1);
      var date28DaysAfter = new Date(date1);


      date28DaysAfter.setDate(standardDate.getDate() +28); // 28일 전 날짜 계산
      date7DaysLater.setDate(standardDate.getDate() + 7); // 7일 후 날짜 계산
      date28DaysBefore.setDate(standardDate.getDate() - 28); // 28일 전 날짜 계산
      date21DaysBefore.setDate(standardDate.getDate() - 21);
      const entireSymptomResponse = await exportService.retrieveEntireSymptom(standardDate, date7DaysLater, user_id)
      const entireCsvData = entireSymptomResponse[0].map(result => `${result.symptom_name},${result.total_degree},${result.start_date}`).join('\n');
      const eachSymptomResponse= await exportService.retrieveSelectedSymptom(user_id, standardDate, date28DaysAfter)
      const csvEachData=eachSymptomResponse[0].map(result=>`${result.symptom_name},${result.degree},${result.date}`).join('\n');
 
      const entireColumn = ['symptom_name', 'total_degree', 'start_date'];
      const entireContent = `${entireColumn.join(',')}\n${entireCsvData}`; // 헤더와 데이터를 합친 내용
      const EachColumn = ['symptom_name', 'degree', 'date'];
      const contentEach = `${EachColumn.join(',')}\n${csvEachData}`; // 헤더와 데이터를 합친 내용
   
      fs.writeFileSync(`csv/entireSymptom.csv`, entireContent, 'utf-8');
      fs.writeFileSync(`csv/eachSymptom.csv`, contentEach, 'utf-8');
   //   console.log("date",date28DaysBefore, date21DaysBefore)
      const lastEntireSymptomResponse = await exportService.retrieveEntireSymptom(date28DaysBefore, date21DaysBefore, user_id)
      const lastEntireCsvData = lastEntireSymptomResponse[0].map(result => `${result.symptom_name},${result.total_degree},${result.start_date}`).join('\n');

      const lastEntireColumn = ['symptom_name', 'total_degree', 'start_date'];
      const lastEntireContent = `${lastEntireColumn.join(',')}\n${lastEntireCsvData}`; // 헤더와 데이터를 합친 내용
 //     console.log('lastEntireSymptomResponse:', lastEntireSymptomResponse);

      fs.writeFileSync(`csv/lastEntireSymptom.csv`, lastEntireContent, 'utf-8');

    //  console.log('Data saved to symptom.csv');

      const spawn = require('child_process').spawn;
    
    //  console.log("hhhhhhhhhhhhhhhhhhhhhhhhh",groupedData)
    const result = spawn('python3', ['public/statistic.py']);

    // Python 프로세스가 종료될 때까지 기다립니다.
    await new Promise((resolve, reject) => {
      result.on('exit', (code) => {
        if (code === 0) {
          // Python script completed successfully
          resolve();
        } else {
          // Python script encountered an error
          console.log('Python script exited with code:', code);
    
          // 여기서 Python 스크립트의 stderr에서 오류 메시지를 얻을 수 있습니다.
          let errorMessages = [];
          result.stderr.on('data', function (data) {
            errorMessages.push(data.toString());
            console.error(data.toString());
          });
    
          // 사용자에게 오류 메시지와 함께 알림을 보냅니다.
          return res.send(`
          <script>
            alert('PDF를 생성하는 과정에서 오류가 발생했습니다. 충분한 데이터가 들어가 있는지 확인해주세요.');
            window.location.href = "/export";
          </script>
        `);
    
          reject(new Error('Python script encountered an error.'));
        }
      });
    });
    
      // 3. stdout의 'data' 이벤트 리스너로 실행 결과를 받습니다.
      result.stdout.on('data', function (data) {
        console.log(data.toString());
      });
    
    // diaryBox 배열에는 각 날짜 범위에 해당하는 데이터가 들어 있음
  //  console.log(diaryBox);


    var startDate = new Date(date1);

    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 27);

    function formatDate(date) {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 만듭니다.
      var day = String(date.getDate()).padStart(2, '0'); // 날짜를 두 자리로 만듭니다.
      return year + '-' + month + '-' + day;
    }

    startDate = formatDate(startDate);
    endDate = formatDate(endDate);


    if (diaryBox.length > 0) {
      ejs.renderFile(path.join("./views/export/pdf.ejs"), { startDate, endDate, diaryBox }, async (err, data) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          try {
            // Puppeteer를 시작합니다.
            const browser = await puppeteer.launch({ headless: "new" });


            // Puppeteer 페이지를 만듭니다.
            const page = await browser.newPage();

            // 페이지에 접속 (예를 들어, 구글 홈페이지로 접속)
            await page.goto('http://www.dementiaguardians.site/');

            // 스크린샷 캡처
            await page.screenshot({ path: 'example.png' });

            // 페이지에 HTML 내용을 설정합니다.
            await page.setContent(data);

            await page.waitForSelector('img');

            // PDF 파일 생성
            await page.pdf({
              path: "report.pdf",
              format: "A4",
              printBackground: true, // 배경 이미지 출력
            });

            // Puppeteer 브라우저를 닫습니다.
            await browser.close();

            res.download('report.pdf', 'report.pdf', (err) => {
              if (err) {
                console.error('PDF Download Error:', err);
              }
              // 파일 삭제
              fs.unlink('report.pdf', (err) => {
                if (err) {
                  console.error('PDF File Deletion Error:', err);
                }
              });
            });
          } catch (error) {
            console.error('Puppeteer Error:', error);
            return res.send(`
            'Failed to generate PDF.
                <script>
                  if (confirm('일기 요약에 실패했습니다.')) {
                    window.location.href = "/export";
                  }
                </script>
              `);
          }
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
   // console.log("\n\n결과: ",summary);
    return summary;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to summarize diary.');
  }
}
