const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const useCaseAuthCredential = {
      owner: 'user-123',
    };

    const useCasePayload = {
      threadId: useCaseParams.threadId,
      owner: useCaseAuthCredential.owner,
      content: 'comment content text',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      owner: useCaseAuthCredential.owner,
      content: 'comment content text',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParams);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      owner: useCaseAuthCredential.owner,
      content: 'comment content text',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      threadId: useCaseParams.threadId,
      owner: useCaseAuthCredential.owner,
      content: useCasePayload.content,
    }));
  });
});
