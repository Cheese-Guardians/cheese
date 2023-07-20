const { response } = require('express');
const pool = require('../main');
const calendarModel = require('../models/communityModel');

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
    
    await calendarModel.insertBoardInfo(pool, insertBoardParams);
    
    return '성공';
  } catch (err) {
      return err;
  }
};
