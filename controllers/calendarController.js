const calendarService = require('../services/calendar');
const path = require('path');

exports.getCalendar = async function (req, res) {
  const userId = req.params.userId;

  // validation
  if(!userId) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
  } 
  if (userId <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
  }

  const calendarResult = await calendarService.retrieveCalendar(userId);
  if (calendarResult.length > 0) {
    console.log(calendarResult);
    console.log(calendarResult[0].server_name + calendarResult[0].extension);
    res.render('../views/calendar/calendar', { calendarResult: calendarResult});
  } else {
    res.render('../views/calendar/calendar', { calendarResult: 0})
  }
  // return res.send(response(baseResponse.SUCCESS, calendarResult));
}

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