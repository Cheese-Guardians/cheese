const communityService = require('../services/communityService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");
const path = require('path');
const querystring = require('querystring');

//게시글 세부 조회
exports.getCommunity = async function (req, res) {
    const boardId = req.params.board_id;
    const communityResult = await communityService.retrieveCommunity(boardId);
    console.log(communityResult);
    return res.render('community/commun_view.ejs', { communityResult: communityResult});
}

exports.getList = async function (req, res) {
    const token = req.cookies.x_auth;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, secret.jwtsecret);
            const user_id = decodedToken.user_id;

            if (!user_id) {
                return res.send(baseResponse.USER_USERIDX_EMPTY);
            }
            if (user_id <= 0) {
                return res.send(baseResponse.USER_USERIDX_LENGTH);
            }

            const { title, updated_at, views } = req.body;

            const communityDataResult = await communityService.retrieveSelectedCommunity(
                user_id,
                title,
                updated_at,
                views
            );

            return res.render('community/infoList', { communResult: communityDataResult });
        } catch (err) {
            return res.send('Error occurred during token verification or community retrieval.');
        }
    } else {
        return res.redirect('/');
    }
};

exports.postBoard = async function (req, res) {
    const token = req.cookies.x_auth;
    if (token) {
        const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
        const user_id = decodedToken.user_id; // user_id를 추출
        // console.log(req.body);
        var updated_at = new Date(); 
        console.log(updated_at);
        //validation
        if(!user_id) {
          return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (user_id <= 0) {
          return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
    
        const {
          category_name,
          title,
          content
      } = req.body;
  
      const createCommunResponse = await communityService.createBoard(
        category_name,
        user_id,
        title,
        content,
        updated_at
      );
      if (createCommunResponse == "성공") {
        if (category_name == "정보게시판"){
            return res.status(200).send(`
          <script>
            if (confirm('게시글 등록에 성공했습니다.')) {
              window.location.href = "/community/infoList";
            }
          </script>
        `);
        }
        else{
            console.log("성공  but 정보 게시판 아님")
        }
        
      } else {
        if (category_name == "정보게시판"){
            return res.send(`
          <script>
            if (confirm('게시글 등록에 실패했습니다.')) {
              window.location.href = "/community/infoList";
            }
          </script>
        `);
        }else{
            
            console.log("실패  but 정보 게시판 아님")
        }
      }
    }
    else {
      return res.send('community req error(token)');
    }
  };

