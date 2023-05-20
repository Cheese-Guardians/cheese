async function insertUserInfo(pool, insertUserPhoneParams, insertUserInfoParams, insertPatientParams) {
    const insertUserPhoneQuery = `
        insert into user_phone (gd_phone, user_name)
        values (?, ?);
      `;
    const insertUserInfoQuery = `
        insert into user (user_id, password, relationship, gd_phone, diagnosis_url, diagnosis_url_pw)
        values (?, ?, ?, ?, null, null);
    `
    const insertPatientQuery = `
        insert into patient (user_id, patient_name, birth_date, dementia_grade, medicine, gender, address)
        values (?, ?, ?, ?, ?, ?, ?);
    `
    const insertUserPhoneRow = await pool.query(
      insertUserPhoneQuery,
      insertUserPhoneParams
    );
    const insertUserInfoRow = await pool.query(
        insertUserInfoQuery,
        insertUserInfoParams
      );
      const insertPatientRow = await pool.query(
        insertPatientQuery,
        insertPatientParams
      );
  }