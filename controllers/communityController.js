// communityController.js
const communityService = require('../services/communityService');
const path = require('path');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const querystring = require('querystring');
const baseResponse = require('../config/baseResponseStatus');

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
