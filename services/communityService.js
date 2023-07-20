// communityService.js
const { response } = require('express');
const pool = require('../main');
const communityModel = require('../models/communityModel');

exports.retrieveSelectedCommunity = async function (user_id) {
    try {
        const selectedCommunityParams = [user_id];
        const communityDataResult = await communityModel.getCommunityList(pool, selectedCommunityParams);

        return communityDataResult;
    } catch (err) {
        return 'retrieveSelectedCommunityError';
    }
}

