const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content text',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'string',
      content: 'string',
      date: 'string',
      username: ['not string'],
      isDeleted: false,
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content text',
      date: '2020-11-11',
      username: 'rafa',
      isDeleted: false,
      commentId: 'comment-123',
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.isDeleted).toEqual(payload.isDeleted);
    expect(detailReply.commentId).toEqual(payload.commentId);
  });
});
