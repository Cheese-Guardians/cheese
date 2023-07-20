async function selectCommunity(pool, boardId) {
    const selectBoardQuery = `
        SELECT *
        FROM board
        WHERE board_id = ?`;
    const [boardRows] = await pool.promise().query(selectBoardQuery, boardId);
    return boardRows;
}
module.exports = {
    selectCommunity
}
// get 리스트
async function getCommunityList(pool, user_id) {
    const getListQuery = `
        SELECT title, updated_at, views
        FROM board
        WHERE category_name ='정보게시판';`
    ;

    const [listRows] = await pool.promise().query(getListQuery); // 매개변수 삭제

    const list = listRows.length > 0 ? listRows.map(row => ({ title: row.title, updated_at: row.updated_at, views: row.views })) : [];

    return list;
}

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
