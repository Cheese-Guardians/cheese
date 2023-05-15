const { response } = require('express');
const pool = require('../main');
const calendarModel = require('../models/calendar');

exports.createFileMem = async function (server_name, user_name, extension) {
    try {
        const insertFileMemParams = [server_name, user_name, extension];
        //console.log(typeof(user_name));
        //console.log(typeof(extension));
        //const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 연결
        
        await calendarModel.insertFileMem(pool, insertFileMemParams);
        
        //connection.release();

        return '성공';
    } catch (err) {
        return 'error';
    }
}

// req로 받아오는 것 : server_name, user_name, extension

