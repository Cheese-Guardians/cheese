//connect database
require('dotenv').config({path: "database.env"});
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

    //let sql = "INSERT INTO category (category_name, description)  VALUES  ('통합게시판', '아무거나 의견을 나눠주세용!!');";
    //let sql2 = "select * from category;";
    //let[rows, fields] = await db.query(sql,sql2);
  
  
    //onsole.log(rows);
const port = 3000,
    express = require("express"),
    cors = require("cors")
    app = express(),
    fs = require("fs"),
    layouts = require("express-ejs-layouts"),
    //const { logger } = require("./config/winston");
    multer  = require('multer'),
    path = require('path'),
    calendarRouter = require('./routes/calendar');



app.set("view engine", "ejs");

app.use(express.static("public/"));
app.use(layouts);
//라우터 등록
app.use('/calendar', calendarRouter);

app.get(
    "/calendar", (req,res) =>
    {
        const sql = "select * from category;";
        pool.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
            res.render('calendar/calendar.ejs', { data: results });
        });
    }
);

app.get(
    "/login", (req,res) =>
    {res.render("users/login");}
);
app.get(
    "/signup", (req,res) =>
    {res.render("users/signup");}
);
app.get(
    "/", (req,res) =>
    {
        const sql = "select * from category;";
        pool.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
            res.render('calendar/calendar.ejs', { data: results });
        });
    }
);

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




// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드된 파일을 저장할 폴더 경로
  },
  filename: (req, file, cb) => {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname); // 저장될 파일 이름 설정
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });



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
    const sql = "select * from category;";
    pool.query(sql, (err, results) => {
        if (err) {
          throw err;
        }
        res.render('calendar/calendar.ejs', { data: results });
    });
  }
});