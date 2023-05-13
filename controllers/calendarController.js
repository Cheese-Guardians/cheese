const calendarService = require('../services/calendar');
const path = require('path');

exports.postFile = async function (req, res) {
    if (!req.file) {
        return res.send(`
          <script>
            if (confirm('파일이 없습니다. 확인을 누르면 메인 페이지로 돌아갑니다.')) {
              window.location.href = "/";
            }
          </script>
        `);
    }

    // const {calendar_id, user_id} = req.body;
    const server_name = req.file.filename
    const user_name = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const extension = path.extname(req.file.filename);

    const attachFileResponse = await calendarService.createFileMem(
        // calendar_id,
        // user_id,
        server_name,
        user_name,
        extension
    );
    // Code for handling file upload and database query goes here
    // res.redirect('/calendar');
    return res.send(attachFileResponse);
  };