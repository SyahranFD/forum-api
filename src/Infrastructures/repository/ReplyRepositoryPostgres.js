const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ReplyRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { commentId, owner, content } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content) VALUES($1, $2, $3, $4) RETURNING id, comment_id, owner, content',
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Sorry, failed to delete reply, id not found');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
