const port = 3000,
    express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts");
    //const { logger } = require("./config/winston");

 app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.get(
    "/", (req,res) =>
    {res.render("index");}
)
app.listen(port,() => {
    console.log("서버 실행 중");
}
)