const { response } = require('express');
const pool = require('../main');
const communityModel = require('../models/communityModel');

// 게시글 조회
exports.retrieveCommunity = async function(boardId, title) {
    const communityParams = [boardId, title];
    const communityResult = await communityModel.selectCommunity(pool,communityParams);
    console.log(communityResult.title);
    return communityResult;
}
// 조회수 업데이트
exports.updateViewsCount = async function (boardId) {
    try {
        // Call the model function to update the views count
        await communityModel.incrementViewsCount(pool, boardId);
    } catch (err) {
        console.error('Error updating views count:', err);
    }
}
// 댓글
exports.retrieveComment = async function(boardId, title) {
    const commentParams = [boardId, title];
    const commentResult = await communityModel.selectComment(pool,commentParams);
    console.log(commentResult.title);
    return commentResult;
}
// 게시물 리스트
exports.retrieveSelectedCommunity = async function (user_id, page) {
    try {
        const selectedCommunityParams = [user_id];
        const communityDataResult = await communityModel.getCommunityList(pool, selectedCommunityParams, page);
        console.log(communityDataResult);

        return communityDataResult;
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
