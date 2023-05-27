const pool = require('../main');
const reminderModel = require('../models/reminderModel');

// 복용약 알림 get
exports.retrieveMedi = async function (user_id) {
    try {
        const mediResult = await reminderModel.selectMedi(pool, user_id);
        return mediResult;
    } catch (err) {
        return 'retrieveMediError'
    }
}