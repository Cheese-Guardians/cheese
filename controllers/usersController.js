const jwtMiddleware = require('../middlewares/jwtMiddleware');

exports.postUsers = async function (req,res) {
    const {
        user_id,
        password,
        gd_phone,
        relationship,
        patient_name,
        user_name,
        birth_date,
        gender,
        dementia_grade,
        medicine,
        address,
    } = req.body;
    const signUpResponse = await userService.createUser(
        user_id,
        password,
        gd_phone,
        relationship,
        patient_name,
        user_name,
        birth_date,
        gender,
        dementia_grade,
        medicine,
        address,
      );
      return res.send(signUpResponse);
};