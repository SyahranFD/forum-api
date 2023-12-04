const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeByCommentId(commentId, owner) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner) VALUES($1, $2, $3) RETURNING id, comment_id, owner',
      values: [id, commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async deleteLikeByCommentId(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async getLikeCountByThreadId(threadId) {
    const query = {
      text: `SELECT likes.comment_id AS commentid
                FROM likes
                INNER JOIN comments ON likes.comment_id = comments.id
                WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async verifyLikeExistAndOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
