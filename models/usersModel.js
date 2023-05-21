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
                SELECT email 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await pool.query(selectUserIdQuery, user_id);
  return emailRows;
}

// 비밀번호 확인
async function selectUserPassword(pool, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT user_id, password
        FROM UserInfo 
        WHERE user_id = ? AND password = ?;`;
  const selectUserPasswordRow = await pool.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

module.exports = {
  insertUserInfo,
  selectUserId,
  selectUserPassword,
  
};
