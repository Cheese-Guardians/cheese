const communityService = require('../services/communityService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");
const path = require('path');
const querystring = require('querystring');

//게시글 세부 조회 + 댓글 조회
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
      const board_id = req.params.board_id;
      const title = req.params.title;
      const communityResult = await communityService.retrieveCommunity(board_id, title);
      
      const commentResult = await communityService.retrieveComment(board_id, title);
      const myPostResult = await communityService.retriveMyPost(user_id);
       //자신의 게시물 개수 제한 7개
       const limitedPosts = myPostResult.slice(0, 7);
       const otherPostResult = await communityService.retrieveOtherPost(user_id, board_id, title);
       //다른 사람의 게시물 개수 제한 13개
       const limitedOtherPosts = otherPostResult.slice(0, 13);
      console.log(communityResult);
      // Combine communityResult and commentResult as needed before rendering the view
      const combinedData = {
        communityResult: communityResult,
        commentResult: commentResult,
        myPostResult: limitedPosts,
        otherPostResult: limitedOtherPosts,
    };
    await communityService.updateViewsCount(board_id);
    console.log("combindedData",combinedData);
      //console.log(communityResult.title);
      return res.render('community/commun_view.ejs', combinedData);
    }
   else {
    return res.redirect('/');
   }
}

exports.getWrite = async function (req, res) {
  const token = req.cookies.x_auth;
    
    if(token) {
      const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화 
      const user_id = decodedToken.user_id; // user_id를 추출
      const board_id = req.params.board_id;
      const title = req.params.title;
      // validation
      if(!user_id) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
      } 
      if (user_id <= 0) {
          return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
      }
      //나의 게시물
     const myPostResult = await communityService.retriveMyPost(user_id); 
     const limitedPosts = myPostResult.slice(0, 7);
     //다른 사람 게시물
      const otherPostResult = await communityService.retrieveOtherPost(user_id, board_id, title);
      const limitedOtherPosts = otherPostResult.slice(0, 13);
      const combinedData = {
      myPostResult: limitedPosts,
      otherPostResult: limitedOtherPosts
      };
      //console.log("combindedData",combinedData);
      //console.log(communityResult.title);
      // 화면 크기에 따라 적절한 템플릿 파일 렌더링
      const userAgent = req.headers['user-agent'];

      if (userAgent.includes('Mobile')) {
        // 모바일 화면일 경우 mobile.ejs 렌더링
        return res.render('community/mobile_commun_write.ejs', combinedData);
      } else {
        // 데스크탑 화면일 경우 desktop.ejs 렌더링
        return res.render('community/commun_write.ejs', combinedData);
      }
    }
    else {
      return res.redirect('/');
    }
  }

//게시글 고민상담소 리스트 조회
exports.getWorryList = async function (req, res) {
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
              const newURL = `${req.protocol}://${req.get('host')}${req.originalUrl}?page=1&page1=1`;
              return res.redirect(newURL);
            }
          }
          let page = req.query.page;
          let page1 = req.query.page1;
          const communityDataResult = await communityService.retrieveWorryCommunity(
              user_id,
              page
          );
          console.log(communityDataResult);
          const communityMyDataResult = await communityService.retrieveMyWorryCommunity(
            user_id,
            page1
        );
        console.log(communityMyDataResult);

        const combinedData = {
          communityDataResult: communityDataResult,
          communityMyDataResult: communityMyDataResult
      };

          return res.render('community/community1.ejs', combinedData);
      } catch (err) {
          return res.send('Error occurred during token verification or community retrieval.');
      }
  } else {
      return res.redirect('/');
  }
};

//게시글 정보공유 리스트 조회
exports.getInfoList = async function (req, res) {
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
                const newURL = `${req.protocol}://${req.get('host')}${req.originalUrl}?page=1&page1=1`;
                return res.redirect(newURL);
              }
            }
            let page = req.query.page;
            let page1 = req.query.page1;
            const communityDataResult = await communityService.retrieveInfoCommunity(
                user_id,
                page
            );
            console.log(communityDataResult);
            const communityMyDataResult = await communityService.retrieveMyInfoCommunity(
              user_id,
              page1
          );
          console.log(communityMyDataResult);

          const combinedData = {
            communityDataResult: communityDataResult,
            communityMyDataResult: communityMyDataResult
        };

            return res.render('community/community2.ejs', combinedData);
        } catch (err) {
            return res.send('Error occurred during token verification or community retrieval.');
        }
    } else {
        return res.redirect('/');
    }
};

//side 게시글 조회 (다른 게시글 보기)
exports.getComment = async function (req, res) {
  const board_id = req.params.board_id;
  const title = req.params.title;
  const commentResult = await communityService.retrieveSide(board_id, title);
  console.log(commentResult);
  //console.log(communityResult.title);
  return res.render('community/side.ejs', { commentResult: commentResult});
};

//게시글 작성
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
      // console.log(req.body.content);
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
          return res.status(200).send(`
          <script>
            if (confirm('게시글 등록에 성공했습니다.')) {
              window.location.href = "/community/worryList";
            }
          </script>
        `);
        }
        
      } else {
            return res.send(`
          <script>
            if (confirm('게시글 등록에 실패했습니다.')) {
              window.location.href = "/community/infoList";
            }
          </script>
        `);
        
      }
    }
    else {
      return res.send('community req error(token)');
    }
  };
  exports.postComment = async function (req, res) {
    const token = req.cookies.x_auth;
    if (token) {
        const decodedToken = jwt.verify(token, secret.jwtsecret); // 토큰 검증, 복호화
        const user_id = decodedToken.user_id; // user_id를 추출
        // console.log(req.body);
        // var updated_at = new Date(); 
        // console.log(updated_at);
        //validation
        if(!user_id) {
          return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (user_id <= 0) {
          return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
        
        const {
          category_name,
          board_id,
          content
      } = req.body;
      // console.log(req.body.content);
      const createCommentResponse = await communityService.createComment(
        user_id,
        category_name,
        board_id,
        content,
        0
      );
      if (createCommentResponse == "성공") {
       
        return res.status(200).send(`
        <script>
            if (confirm('게시글 등록에 성공했습니다.')) {
                const board_id = ${req.body.board_id}; 
                window.location.href = "/community/write/" + board_id;
            }
        </script>
    `);
    
        
        
      } else
      {
        return res.send(`
        <script>
          if (confirm('게시글 등록에 실패했습니다.')) {
            const board_id = ${req.body.board_id}; 
            window.location.href = "/community/write/" + board_id;
          }
        </script>
      `);
      }
        
    }
    else {
      return res.send('Comment req error(token)');
    }
  };
