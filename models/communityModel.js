async function insertBoardInfo(pool, insertBoardParams){
   
      const insertBoardQuery = `
        INSERT INTO board (category_name, user_id, title, content, updated_at, views) VALUES (?, ?, ?, ?, ?, ?);
      `;
      
      
    const connection = await pool.promise().getConnection();
    
    try {
        await connection.query(insertBoardQuery, insertBoardParams);
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        connection.release();
    }
  }
  module.exports = {
    insertBoardInfo
  }