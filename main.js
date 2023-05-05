const port = 3000,
    express = require("express"),
    app = express();
//const { logger } = require("./config/winston");

app.use("/", (req,res) =>
    {res.send("안녕");}
 )

app.listen(port,() => {
    console.log("서버 실행중");
}
)