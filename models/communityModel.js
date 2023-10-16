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
    SELECT title, board_id
    FROM board
    WHERE user_id = ?
  `
  const [userPostingRow] = await pool.promise().query(selectMyPostQuery, user_id);
  const list = userPostingRow.length > 0 ? userPostingRow.map(row => ({
    board_id : row.board_id,
    title : row.title
     })) : [];
  return list;
}
async function selectOtherPost(pool, user_id, boardId, title) {
  const selectCommunityQuery = `
    SELECT title, board_id
    FROM board
    WHERE user_id != ?
  `;
  const [communityPosts] = await pool.promise().query(selectCommunityQuery,user_id, boardId, title);
  const list = communityPosts.length > 0 ? communityPosts.map(row => ({
    board_id : row.board_id,
    title : row.title
     })) : [];
  return list;
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

//getList
// get 고민상담소 리스트
async function getWorryList(pool, user_id, page) {
  const ITEMS_PER_PAGE = 9; // 한 페이지에 보여줄 게시글 수

  // 클라이언트에서 요청한 페이지 번호를 받아옵니다.
  const pageNumber = page;

  // MySQL 쿼리에서 LIMIT 절을 사용하여 해당 페이지의 데이터만 가져오도록 합니다.
  const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
  const getListQuery = `SELECT board_id, title, updated_at, views
  FROM board
  WHERE category_name = '자유게시판'
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

// get my 고민상담소 리스트
async function getMyWorryList(pool, user_id, page) {
const ITEMS_PER_PAGE = 7; // 한 페이지에 보여줄 게시글 수

// 클라이언트에서 요청한 페이지 번호를 받아옵니다.
const pageNumber = page;

// MySQL 쿼리에서 LIMIT 절을 사용하여 해당 페이지의 데이터만 가져오도록 합니다.
const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
const getListQuery = `
SELECT board_id, title, updated_at, views
FROM board
WHERE (category_name = '자유게시판' and user_id = ?)
ORDER BY board_id DESC
LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`

;

const [listRows] = await pool.promise().query(getListQuery, user_id);

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
const originalDate = new Date(dateTimeString).toLocaleString('en-US', {
  timeZone: 'Asia/Seoul',
});

const hours = new Date(originalDate).getHours(); // Local time in Seoul (hours)
const minutes = new Date(originalDate).getMinutes(); // Local time in Seoul (minutes)


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

// get 정보공유 리스트
async function getInfoList(pool, user_id, page) {
    const ITEMS_PER_PAGE = 9; // 한 페이지에 보여줄 게시글 수

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

// get my 정보공유 리스트
async function getMyInfoList(pool, user_id, page) {
  const ITEMS_PER_PAGE = 7; // 한 페이지에 보여줄 게시글 수

  // 클라이언트에서 요청한 페이지 번호를 받아옵니다.
  const pageNumber = page;

  // MySQL 쿼리에서 LIMIT 절을 사용하여 해당 페이지의 데이터만 가져오도록 합니다.
  const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
  const getListQuery = `
  SELECT board_id, title, updated_at, views
  FROM board
  WHERE (category_name = '정보게시판' and user_id = ?)
  ORDER BY board_id DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};`
  
  ;

  const [listRows] = await pool.promise().query(getListQuery, user_id);

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
  const originalDate = new Date(dateTimeString).toLocaleString('en-US', {
    timeZone: 'Asia/Seoul',
  });
  
  const hours = new Date(originalDate).getHours(); // Local time in Seoul (hours)
  const minutes = new Date(originalDate).getMinutes(); // Local time in Seoul (minutes)
  
  // 두 자리 수로 포맷팅
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}`;
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
    getWorryList,
    getMyWorryList,
    getInfoList,
    getMyInfoList,
    selectCommunity,
    selectMyPost,
    selectOtherPost
  }
