const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'thread title text',
      body: 'thread body text',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'string',
      title: 'string',
      body: ['not string'],
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'thread title text',
      body: 'thread body text',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.owner).toEqual(payload.owner);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});
