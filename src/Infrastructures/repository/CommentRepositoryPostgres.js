const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { threadId, owner, content } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, thread_id, owner, content) VALUES($1, $2, $3, $4) RETURNING id, thread_id, owner, content',
      values: [id, threadId, owner, content],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('sorry failed to delete comment, id not found');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const comment = rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses comment ini');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted AS isDeleted
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE comments.thread_id = $1
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const mappedRows = rows.map(({ isdeleted, ...detailComment }) => detailComment);

    return mappedRows;
  }
}

module.exports = CommentRepositoryPostgres;
