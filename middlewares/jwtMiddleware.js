const jwt = require('jsonwebtoken');
const secret_config = require('../config/secret');
const baseResponse = require("../config/baseResponseStatus");


const jwtMiddleware = (req, res, next) => {
    // read the token from header or url
    let token = req.cookies.x_auth;
    // token does not exist
    if(!token) {
        return res.send(baseResponse.TOKEN_EMPTY)
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            // 토큰 검증
            jwt.verify(token, secret_config.jwtsecret , (err, verifiedToken) => {
                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        return res.send(baseResponse.TOKEN_VERIFICATION_FAILURE)
    };
    // process the promise
    p.then((verifiedToken)=>{
        //비밀 번호 바뀌었을 때 검증 부분 추가 할 곳
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

module.exports = jwtMiddleware;