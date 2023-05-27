const reminderService = require('../services/reminderService');
exports.postMedi = async function (req, res) {
    const {
        user_id,
        medi_reminder_time
    } = req.body;
    const MediResponse = await reminderService.createMediReminder(
        user_id,
        medi_reminder_time
    );
   return res.send(MediResponse);
};
