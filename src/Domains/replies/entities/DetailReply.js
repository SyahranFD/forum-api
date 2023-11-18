class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isdeleted, commentid,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isdeleted = isdeleted;
    this.commentid = commentid;
  }

  _verifyPayload({
    id, content, date, username, isdeleted, commentid,
  }) {
    if (!id || !content || !date || !username || isdeleted === undefined || !commentid) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
          || typeof content !== 'string'
          || typeof date !== 'string'
          || typeof username !== 'string'
          || typeof isdeleted !== 'boolean'
          || typeof commentid !== 'string'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
