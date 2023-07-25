async function selectCommunity(pool, boardId, title) {
    const selectBoardQuery = `
        SELECT *
        FROM board
        WHERE board_id = ?`;
        
    const [boardRows] = await pool.promise().query(selectBoardQuery, boardId, title);
    
    const list = boardRows.length > 0 ? boardRows.map(row => ({
      category_name : row.category_name, 
      user_id : row.user_id,
      board_id : row.board_id,
      title : row.title,
      content : row.content,
      updated_at : row.updated_at,
      views : row.views
       })) : [];
    console.log("list:",list);
   return list;
}
async function selectMyPost(pool, user_id) {
  const selectMyPostQuery = `
    SELECT title
    FROM board
    WHERE user_id = ?
  `
  const [userPostingRow] = await pool.promise().query(selectMyPostQuery, user_id);
  return userPostingRow;
}

async function selectComment(pool, boardId, title) {
  const selectCommentQuery = `
  SELECT *
  FROM reply
  WHERE board_id = ?`;
      
  const [commentRows] = await pool.promise().query(selectCommentQuery, boardId, title);
  
  const list = commentRows.length > 0 ? commentRows.map(row => ({
    category_name : row.category_name, 
    board_id : row.board_id,
    reply_id : row.reply_id,
    content : row.content,
    parent_id : row.parent_id,
    user_id : row.user_id,
     })) : [];
  console.log("comment:",list);
 return list;
}


//조회수 update
async function incrementViewsCount(pool, boardId) {
  const updateViewsCountQuery = `
      UPDATE board
      SET views = views + 1
      WHERE board_id = ?`;

      const [viewRows] = await pool.promise().query(updateViewsCountQuery, boardId);
      return viewRows;
}


// get 리스트
async function getCommunityList(pool, user_id, page) {
    const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 게시글 수

    // 클라이언트에서 요청한 페이지 번호를 받아옵니다.
    const pageNumber = page;

    // MySQL 쿼리에서 LIMIT 절을 사용하여 해당 페이지의 데이터만 가져오도록 합니다.
    const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
    const getListQuery = `SELECT board_id, title, updated_at, views
    FROM board
    WHERE category_name = '정보게시판'
    ORDER BY board_id DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`
    
    ;

    const [listRows] = await pool.promise().query(getListQuery);

    const list = listRows.length > 0 ? listRows.map(row => ({
       board_id : row.board_id,
       title: row.title,
       updated_date: formatDate(row.updated_at), // Convert the date format here
       updated_time: formatTime(row.updated_at),
       views: row.views
        })) : [];

    return list;
}

// get my 리스트
async function getMyCommunityList(pool, user_id, page) {
  const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 게시글 수

  // 클라이언트에서 요청한 페이지 번호를 받아옵니다.
  const pageNumber = page;

  // MySQL 쿼리에서 LIMIT 절을 사용하여 해당 페이지의 데이터만 가져오도록 합니다.
  const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
  const getListQuery = `
  SELECT board_id, title, updated_at, views
  FROM board
  WHERE (category_name = '정보게시판' and user_id = 'haeun161')
  ORDER BY board_id DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`
  
  ;

  const [listRows] = await pool.promise().query(getListQuery);

  const list = listRows.length > 0 ? listRows.map(row => ({
     board_id : row.board_id,
     title: row.title,
     updated_date: formatDate(row.updated_at), // Convert the date format here
     updated_time: formatTime(row.updated_at),
     views: row.views
      })) : [];

  return list;
}

// Function to format the date as "YYYY-MM-DD HH:MM"
function formatDate(dateTimeString) {
  const originalDate = new Date(dateTimeString);
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, '0');
  const day = String(originalDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function formatTime(dateTimeString) {
    const originalDate = new Date(dateTimeString);
    const hours = originalDate.getUTCHours(); // UTC 기준 시간
    const minutes = originalDate.getUTCMinutes(); // UTC 기준 분
  
    return `${hours}:${minutes}`;
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
async function insertCommentInfo(pool, insertCommentParams){

 
   
  const insertCommentQuery = `
    INSERT INTO reply (user_id, category_name, board_id, content, parent_id) VALUES (?, ?, ?, ?, NULL);
  `;
  
  
const connection = await pool.promise().getConnection();

  try {
  //await connection.query(baseCommentQuery, baseCommentParams);
  await connection.query(insertCommentQuery, insertCommentParams);
  } 
  catch (error) {
      console.log(error);
      throw error;
  } finally {
      connection.release();
  }
    
}

  module.exports = {
    insertBoardInfo,
    selectComment,
    insertCommentInfo,
    incrementViewsCount,
    getCommunityList,
    getMyCommunityList,
    selectCommunity,
    selectMyPost
  }
