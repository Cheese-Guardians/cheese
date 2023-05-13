const Calendar = require('../models/calendar');

exports.postFiles = async (req, res) => {
    const {file} = req.file;
}

// 파일 업로드를 처리하는 라우트 핸들러
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        // 파일이 없을 경우 팝업 창 표시 후 확인 시 "/" 페이지로 리다이렉션
        return res.send(`
          <script>
            if (confirm('파일이 없습니다. 확인을 누르면 메인 페이지로 돌아갑니다.')) {
              window.location.href = "/";
            }
          </script>
        `);
    } else {
      // const sql = "select * from category;";
      // pool.query(sql, (err, results) => {
      //     if (err) {
      //       throw err;
      //     }
      //     res.render('\calendar/calendar.ejs', { data: results });
      // });
    }
  });