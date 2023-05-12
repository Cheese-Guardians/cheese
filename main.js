const port = 3003,
    express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts");
    //const { logger } = require("./config/winston");
var multer=require('multer');
var upload=multer({dest:'uploads/'});


 app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.get(
    "/calendar", (req,res) =>
    {res.render("calendar");}
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
    "/", (req,res) =>
    {res.render("calendar");}
)

app.get(
    "/community-side", (req,res) =>
    {res.render("\community/community-side");}
)

app.listen(port,() => {
    console.log("서버 실행 중");
}
)

app.post('/upload', upload.single('memorizes'), function(req,res){
    res.send('Uploaded! : '+req.file); // object를 리턴함
    console.log(req.file); 
})