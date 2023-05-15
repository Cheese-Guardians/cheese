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