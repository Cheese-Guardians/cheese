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
