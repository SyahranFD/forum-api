const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCaseAuthCredential = {
      owner: 'user-123',
    };

    const useCaseParams = {
      threadId: 'thread-123',
    };

    const useCasePayload = {
      content: 'comment-content-text',
      owner: useCaseAuthCredential.owner,
      threadId: useCaseParams.threadId,
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'comment-content-text',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'comment-content-text',
      owner: 'user-123',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      owner: useCaseAuthCredential.owner,
      threadId: useCaseParams.threadId,
    }));
  });
});
