const port = 3003,
    express = require("express"), 
    cors=require("cors")
    app = express(),
    fs = require("fs"),
    layouts = require("express-ejs-layouts");
    //const { logger } = require("./config/winston");
    const multer  = require('multer')
    const path = require('path');
    

 app.set("view engine", "ejs");

  // 정적 파일 제공을 위한 미들웨어 설정
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

app.listen(port,() => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    console.log("서버 실행 중");
}
)




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
        res.render("calendar");
    }
  });