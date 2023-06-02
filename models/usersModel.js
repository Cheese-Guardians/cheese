// 회원가입
async function insertUserInfo(pool, insertUserPhoneParams, insertUserInfoParams, insertPatientParams) {
  const insertUserPhoneQuery = `
      insert into user_phone (gd_phone, user_name)
      values (?, ?);
  `;
  const insertUserInfoQuery = `
      insert into user (user_id, password, relationship, gd_phone, diagnosis_url, diagnosis_url_pw)
      values (?, ?, ?, ?, null, null);
  `;
  const insertPatientQuery = `
      insert into patient (user_id, patient_name, birth_date, dementia_grade, medicine, gender, address)
      values (?, ?, ?, ?, ?, ?, ?);
  `;

  const connection = await pool.promise().getConnection();
  try {
      await connection.query('START TRANSACTION');

      await connection.query(insertUserPhoneQuery, insertUserPhoneParams);
      await connection.query(insertUserInfoQuery, insertUserInfoParams);
      await connection.query(insertPatientQuery, insertPatientParams);

      await connection.query('COMMIT');
  } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
  } finally {
      connection.release();
  }
}

// 아이디 확인
async function selectUserId(pool, user_id) {
  const selectUserIdQuery = `
        SELECT user_id 
        FROM user 
        WHERE user_id = ?;
                `;
  const [userIdRows] = await pool.promise().query(selectUserIdQuery, user_id);
  return userIdRows;
}

// 비밀번호 확인
async function selectUserPassword(pool, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT user_id, password
        FROM user 
        WHERE user_id = ? AND password = ?;`;
  const selectUserPasswordRow = await pool.promise().query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 이름 조회
async function selectUserAccount(pool, user_id) {
  const selectUserAccountQuery = `
        SELECT up.user_name
        FROM user u
        JOIN user_phone up ON u.gd_phone = up.gd_phone
        WHERE u.user_id = ?;
        `;
  const selectUserAccountRow = await pool.promise().query(
      selectUserAccountQuery,
      user_id
  );
  return selectUserAccountRow[0];
}

// jwt 저장
async function insertUserJWT(pool, insertUserJWTParams) {
  const insertUserJWTQuery = `
        UPDATE user
        SET jwt = ?
        WHERE user_id = ?;
  `;

  const insertUserJWTRow = await pool.promise().query(insertUserJWTQuery, insertUserJWTParams);
  return insertUserJWTRow;
}


module.exports = {
  insertUserInfo,
  selectUserId,
  selectUserPassword,
  selectUserAccount,
  insertUserJWT,
};
