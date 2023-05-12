// const db = mysql.createPool({ 
//     host: process.env.DB_HOST, 
//     user: process.env.DB_USER, 
//     password: process.env.DB_PW, 
//     port: process.env.DB_PORT, 
//     database: process.env.DB_NAME, 
//     waitForConnections: true, 
//     insecureAuth: true
// });

// let sql = 'SELECT * FROM category';
// let[rows,fields] = await db.query(sql);
// console.log(rows);

const port = 3000,
    express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts");
    //const { logger } = require("./config/winston");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.get(
    "/calendar", (req,res) =>
    {res.render("\calendar/calendar.ejs");}
)
app.get(
    "/login", (req,res) =>
    {res.render("login");}
)
app.get(
    "/signup", (req,res) =>
    {res.render("signup");}
)

app.get(
    "/community", (req,res) =>
    {res.render("\community/community.ejs");}
)

app.get(
    "/", (req,res) =>
    {res.render("calendar");}
)



app.listen(port,() => {
    console.log("서버 실행 중");
}
)

require('dotenv').config({path: "database.env"});
const mysql = require('mysql2/promise'); 

let test = async () => {
    const db = mysql.createPool({ 
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PW, 
        port: process.env.DB_PORT, 
        database: process.env.DB_NAME, 
        waitForConnections: true, 
        insecureAuth: true
    });

    let sql = 'SELECT * FROM category';
    let[rows,fields] = await db.query(sql);
    console.log(rows);
};


test()
