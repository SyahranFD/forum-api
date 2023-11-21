const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
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

    const { rows } = await this._pool.query(query);

    return new AddedReply({ ...rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1 RETURNING id',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyReplyExist(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    const reply = rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses reply ini');
    }
  }

  async getReplyByThreadId(id) {
    const query = {
      text: `SELECT replies.id, replies.comment_id AS commentid, replies.content, replies.date, users.username, replies.is_deleted AS isdeleted
              FROM replies 
              INNER JOIN comments ON replies.comment_id = comments.id
              INNER JOIN users ON replies.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY replies.date ASC`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    const mappedReplies = rows.map((reply) => new DetailReply({
      ...reply,
      date: reply.date.toISOString(),
    }));

    return mappedReplies;
  }
}

module.exports = ReplyRepositoryPostgres;
