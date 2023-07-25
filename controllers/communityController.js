const communityService = require('../services/communityService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");
const path = require('path');
const querystring = require('querystring');

//게시글 세부 조회
exports.getCommunity = async function (req, res) {
    const token = req.cookies.x_auth;
    
    if(token) {
      const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화 
      const user_id = decodedToken.user_id; // user_id를 추출

      // validation
      if(!user_id) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
      } 
      if (user_id <= 0) {
          return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
      }
      const boardId = req.params.board_id;
      const title = req.params.title;
      const communityResult = await communityService.retrieveCommunity(boardId, title);
      await communityService.updateViewsCount(boardId);
      console.log(communityResult);
      //console.log(communityResult.title);
      return res.render('community/commun_view.ejs', { communityResult: communityResult});
    }
   else {
    return res.redirect('/');
   }
}
//내가 쓴 글 조회
exports.getMyPost = async function (req, res) {
  const token = req.cookies.x_auth;
    
    if(token) {
      const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화 
      const user_id = decodedToken.user_id; // user_id를 추출

      // validation
      if(!user_id) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
      } 
      if (user_id <= 0) {
          return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
      }
     const myPostResult = await communityService.retriveMyPost(user_id); 
      console.log(myPostResult);
      //console.log(communityResult.title);
      return res.render('community/commun_view.ejs', { myPostResult: myPostResult});
    }
   else {
    return res.redirect('/');
   }
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
            if (!req.query.page){
              const existingQueryString = req.query;
      
              if (Object.keys(existingQueryString).length === 0) {
                const newURL = `${req.protocol}://${req.get('host')}${req.originalUrl}?page=1`;
                return res.redirect(newURL);
              }
            }
            let page = req.query.page;

            const communityDataResult = await communityService.retrieveSelectedCommunity(
                user_id,
                page
            );
            console.log(communityDataResult);

            return res.render('community/community2.ejs', { communityDataResult: communityDataResult });
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

