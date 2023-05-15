const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // 업로드된 파일을 저장할 폴더 경로
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname); // 저장될 파일 이름 설정
        cb(null, fileName);
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = { upload };