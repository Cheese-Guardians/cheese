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