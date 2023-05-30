//connect database
require('dotenv').config({path: "./config/database.env"});
const mysql = require ('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    insecureAuth: true
});

module.exports = pool;  //모듈로 내보내기

require('dotenv').config({path: "./config/sens.env"}); // sens.env 불러오기

const port = 3030,
    express = require("express"),
    cors = require("cors")
    app = express(),
    fs = require("fs"),
    layouts = require("express-ejs-layouts"),
    calendarRouter = require('./routes/calendar'),
    usersRouter = require('./routes/usersRoute'),
    reminderRouter = require('./routes/reminderRoute'),
    diagnosisRouter = require('./routes/diagnosisRoute');

const cookieParser = require('cookie-parser');


app.set("view engine", "ejs");

app.use(express.static("public/"));
app.use('/uploads',express.static("uploads/"));
app.use(layouts);
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

// const authenticateUser = (req, res, next) => {
//     const token = req.cookies.x_auth;
//     // 로그인 여부를 확인하고 로그인되어 있지 않으면 로그인 페이지로 리다이렉트 또는 다른 처리를 수행할 수 있습니다.
//     if (!token) { // req.user는 로그인된 사용자 정보를 담고 있는 객체입니다.
//       return res.redirect('/'); // 로그인 페이지로 리다이렉트
//     }
//     // 로그인된 사용자이면 다음 미들웨어로 진행
//     next();
//   };

//라우터 등록
app.use('/calendar', calendarRouter);
app.use('/users', usersRouter);
app.use('/reminder', reminderRouter);
app.use('/diagnosis', diagnosisRouter);


app.get(
    "/", (req,res) =>
    {res.render("users/login.ejs");}
);

app.get(
    "/calendar", (req,res) =>
    {res.render('calendar/calendar.ejs');}
);
    
// app.get(
//     "/", (req,res) =>
//     {
//         const sql = "select * from category;";
//         pool.query(sql, (err, results) => {
//             if (err) {
//               throw err;
//             }
//             res.render('calendar/calendar.ejs', { data: results });
//         });


//     }
// );

app.get(
  "/community", (req, res) => 
  {res.render("\community/community");}
)

app.get(
    "/community-side", (req,res) =>
    {res.render("community/community-side");}
)

app.listen(port,() => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
  }
  console.log("서버 실행 중");
  }
);

module.exports = {
    // authenticateUser
}