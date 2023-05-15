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
    const server_name = path.basename(req.file.filename, path.extname(req.file.originalname)); //서버증상
    const user_name = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const extension = path.extname(req.file.filename);
    console.log(server_name + user_name + extension);
    const attachFileResponse = await calendarService.createFileMem(
        // calendar_id,
        // user_id,
        server_name,
        user_name,
        extension
    );
    // Code for handling file upload and database query goes here
    if (attachFileResponse == "성공") {
      return res.redirect('/calendar');
    }
    else res.send(attachFileResponse);
    //return res.redirect('/calendar');
    //res.send(attachFileResponse);
  };