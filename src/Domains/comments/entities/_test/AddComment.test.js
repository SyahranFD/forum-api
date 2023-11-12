const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comment content text',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'string',
      owner: 'string',
      threadId: ['not string'],
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'comment content text',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.content).toEqual(payload.content);
  });
});
