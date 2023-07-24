const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const ejs = require('ejs');
const pdf = require("html-pdf");
const fs = require('fs');
const path = require('path');

// 간호 다이어리 통계 내보내기
router.get(
    "/", (req,res) =>
    {res.render("export/exportPdf.ejs");}
);

// 간호 다이어리 통계 PDF
router.get(
    "/pdf", (req,res) => {
        ejs.renderFile(path.join('./views/', "export/pdf.ejs"), (err, data) => {
            if (err) {
                  res.send(err);
            } else {
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };
                pdf.create(data, options).toFile("report.pdf", function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.download('report.pdf', 'report.pdf', (err) => {
                            if (err) {
                                console.error('PDF Download Error:', err);
                            }
                            //파일 삭제
                            fs.unlink('report.pdf', (err) => {
                                if (err) {
                                    console.error('PDF File Deletion Error:', err);
                                }
                            });
                        });
                    }
                });
            }
        });
    }
);


// gpt post
router.post('/', exportController.postSummary);

// 비밀번호 체크
// router.post("/check/password", exportController.checkPassword);

router.get(
    "/check/password", (req,res) =>
    {res.render("export/password.ejs");}
);

module.exports = router;