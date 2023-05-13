// const pool = require('../main');

async function insertFileMem(pool, insertFileMemParams) {
    const insertFileMemQuery = `
        INSERT INTO file_memories (calendar_id, user_id, server_name, user_name, extension)
        VALUES (0, 'handakyeng', ?, ?, ?);
    `;
    const insertFileMemRow = await pool.query(
        insertFileMemQuery,
        insertFileMemParams
    );

    return insertFileMemRow;
}

module.exports = {
    insertFileMem,
}