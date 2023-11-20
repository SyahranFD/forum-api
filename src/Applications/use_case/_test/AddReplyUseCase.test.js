const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const useCaseAuthCredential = {
      owner: 'user-123',
    };

    const useCasePayload = {
      commentId: useCaseParams.commentId,
      owner: useCaseAuthCredential.owner,
      content: 'reply content text',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      owner: useCaseAuthCredential.owner,
      content: 'reply content text',
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParams);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      owner: useCaseAuthCredential.owner,
      content: 'reply content text',
    }));

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCaseParams.commentId);

    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      commentId: useCaseParams.commentId,
      owner: useCaseAuthCredential.owner,
      content: useCasePayload.content,
    }));
  });
});
