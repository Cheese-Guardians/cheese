const usersService = require('../services/usersService');
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
        address
    } = req.body;
    const signUpResponse = await usersService.createUser(
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
        address
      );
      return res.send(signUpResponse);
};

exports.login = async function (req, res) {
    const { user_id, password } = req.body;

  // TODO: email, password 형식적 Validation

  const signInResponse = await usersService.postSignIn(user_id, password);

  return res.send(signInResponse);
};