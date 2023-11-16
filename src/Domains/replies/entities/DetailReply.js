class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDeleted, commentId,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDeleted = isDeleted;
    this.commentId = commentId;
  }

  _verifyPayload({
    id, content, date, username, isDeleted, commentId,
  }) {
    if (!id || !content || !date || !username || isDeleted === undefined || !commentId) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
          || typeof content !== 'string'
          || typeof date !== 'string'
          || typeof username !== 'string'
          || typeof isDeleted !== 'boolean'
          || typeof commentId !== 'string'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
