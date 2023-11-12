/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-123', owner = 'user-123', content = 'comment content text',
  }) {
    const query = {
      text: 'INSERT INTO comments (id, thread_id, owner, content) VALUES($1, $2, $3, $4)',
      values: [id, threadId, owner, content],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
