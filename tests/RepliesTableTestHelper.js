/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentid = 'comment-123', owner = 'user-123', content = 'reply content text', isdeleted = 'false',
  }) {
    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, commentid, owner, content, isdeleted],
    };

    await pool.query(query);
  },

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
