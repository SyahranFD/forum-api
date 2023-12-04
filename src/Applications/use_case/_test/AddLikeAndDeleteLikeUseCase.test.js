const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeAndDeleteLikeByIdUseCase = require('../AddLikeAndDeleteLikeByIdUseCase');

describe('a AddLikeAndDeleteLikeUseCase use case', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeExistAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(0));
    mockLikeRepository.addLikeByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new AddLikeAndDeleteLikeByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCaseParams.commentId);
    expect(mockLikeRepository.verifyLikeExistAndOwner).toBeCalledWith(
      useCaseParams.commentId,
      useCaseParams.owner,
    );
    expect(mockLikeRepository.addLikeByCommentId).toBeCalledWith(
      useCaseParams.commentId,
      useCaseParams.owner,
    );
  });

  it('should orchestrating the delete like comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.verifyLikeExistAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockLikeRepository.deleteLikeByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new AddLikeAndDeleteLikeByIdUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCaseParams);

    // Assert
    expect(mockLikeRepository.verifyLikeExistAndOwner).toBeCalledWith(
      useCaseParams.commentId,
      useCaseParams.owner,
    );
    expect(mockLikeRepository.deleteLikeByCommentId).toBeCalledWith(
      useCaseParams.commentId,
      useCaseParams.owner,
    );
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCaseParams.commentId);
  });
});
