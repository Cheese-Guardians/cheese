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