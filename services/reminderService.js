const { response } = require('express');
const pool = require('../main');
const reminderModel = require('../models/reminderModel');
const baseResponse = require("../config/baseResponseStatus");

exports.createMediReminder = async function (
    user_id,
    medi_reminder_time
) {
    try {
        const insertMediReminderParams = [
            user_id,
            medi_reminder_time
        ];
        const mediReminderResult = await reminderModel.insertMediReminder(pool, insertMediReminderParams);
        console.log(mediReminderResult[0].user_id)
        return baseResponse.SUCCESS;
    } catch (err) {
        return baseResponse.DB_ERROR;
    }
}