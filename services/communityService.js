const { response } = require('express');
const pool = require('../main');
const communityModel = require('../models/communityModel');

// 게시글 조회
exports.retrieveCommunity = async function (board_id, title) {
    const communityParams = [board_id, title];
    const communityResult = await communityModel.selectCommunity(pool, communityParams);
    if (communityResult.length > 0) {
      console.log(communityResult[0].title); // Access the title property of the first element
      return communityResult[0];
    } else {
      // Handle the case when no communityResult is found (e.g., return an empty object or null)
      return null;
    }
  };
  
//내가 쓴 글 전체 조회
exports.retriveMyPost = async function(user_id){
    const myPostResult = await communityModel.selectMyPost(pool,user_id);
    console.log(myPostResult);
    return myPostResult;
};

//다른 사람이 쓴 글 전체 조회
exports.retrieveOtherPost = async function (user_id, board_id, title) {
    try {
    const communityPosts = await communityModel.selectOtherPost(pool, user_id, board_id, title);
    return communityPosts;
    } catch(error) {
        console.error("Error retrieving community posts: ", error);
        throw error; 
    }
}

// 조회수 업데이트
exports.updateViewsCount = async function (board_id) {
    try {
        // Call the model function to update the views count
        await communityModel.incrementViewsCount(pool, board_id);
    } catch (err) {
        console.error('Error updating views count:', err);
    }
}
// 댓글
exports.retrieveComment = async function(board_id, title) {
    const commentParams = [board_id, title];
    const commentResult = await communityModel.selectComment(pool,commentParams);
    console.log(commentResult.title);
    return commentResult;
}

// 고민상담소 게시판 리스트
exports.retrieveWorryCommunity = async function (user_id, page) {
    try {
        const selectedCommunityParams = [user_id];
        const communityDataResult = await communityModel.getWorryList(pool, selectedCommunityParams, page);
        console.log(communityDataResult);

        return communityDataResult;
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedCommunityError';
    }
}

// 정보 공유 게시판 리스트
exports.retrieveInfoCommunity = async function (user_id, page) {
    try {
        const selectedCommunityParams = [user_id];
        const communityDataResult = await communityModel.getInfoList(pool, selectedCommunityParams, page);
        console.log(communityDataResult);

        return communityDataResult;
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedCommunityError';
    }
}

// 나의 고민상담소 게시판 리스트
exports.retrieveMyWorryCommunity = async function (user_id, page) {
    try {
        const selectedCommunityParams = [user_id];
        const communityMyDataResult = await communityModel.getMyWorryList(pool, selectedCommunityParams, page);
        console.log(communityMyDataResult);

        return communityMyDataResult;
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedCommunityError';
    }
}

// 나의 정보게시판 리스트
exports.retrieveMyInfoCommunity = async function (user_id, page) {
    try {
        const selectedCommunityParams = [user_id];
        const communityMyDataResult = await communityModel.getMyInfoList(pool, selectedCommunityParams, page);
        console.log(communityMyDataResult);

        return communityMyDataResult;
    } catch (err) {
        console.log(err);
        return 'retrieveSelectedCommunityError';
    }
}


//게시글 작성 
exports.createBoard = async function (
    category_name,
    user_id,
    title,
    content,
    updated_at
) {
  try {
   
    const insertBoardParams = [
        category_name,
        user_id,
        title,
        content,
        updated_at,
        0
    ];
    
    await communityModel.insertBoardInfo(pool, insertBoardParams);
    
    return '성공';
  } catch (err) {
      return err;
  }
};

exports.createComment = async function (
        user_id,
        category_name,
        board_id,
        content,
        parent_id
) {
  try {
    const baseCommentParams = [
        user_id,
        category_name,
        board_id,
        content,
        board_id
    ];
    const insertCommentParams = [

        user_id,
        category_name,
        board_id,
        content,
        parent_id
    ];
    
    await communityModel.insertCommentInfo(pool, baseCommentParams, insertCommentParams);
    
    return '성공';
  } catch (err) {
      return err;
  }
};
