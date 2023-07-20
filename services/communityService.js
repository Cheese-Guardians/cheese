const { response } = require('express');
const pool = require('../main');
const communityModel = require('../models/communityModel');

exports.retrieveCommunity = async function(boardId) {
    const communityResult = await communityModel.selectCommunity(pool, boardId);
    return communityResult;
}