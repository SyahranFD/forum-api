class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isdeleted, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.isdeleted = isdeleted;
    this.replies = replies || [];
  }

  _verifyPayload({
    id, username, date, content, isdeleted, replies,
  }) {
    if (!id || !username || !date || !content || isdeleted === undefined || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
          || typeof username !== 'string'
          || typeof date !== 'string'
          || typeof content !== 'string'
          || typeof isdeleted !== 'boolean'
          || !(Array.isArray(replies))
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
