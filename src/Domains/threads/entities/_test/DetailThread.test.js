const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title text',
      body: 'thread title body',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'string',
      title: 'string',
      body: 'string',
      date: 'string',
      username: 'not string',
      comments: 'string',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title text',
      body: 'thread title body',
      date: '2020-11-11',
      username: 'user-123',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
