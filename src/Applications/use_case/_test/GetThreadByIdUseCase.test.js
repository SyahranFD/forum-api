const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const mockThreadDetail = {
      id: useCaseParams.threadId,
      title: 'thread title text',
      body: 'thread title body',
      date: '2020-11-11',
      username: 'rafa',
    };

    const mockCommentDetail = [
      {
        id: 'comment-111',
        username: 'syahran',
        date: '2020-11-11',
        content: 'comment content text',
        isdeleted: false,
      },

      {
        id: 'comment-222',
        username: 'fadhil',
        date: '2020-11-11',
        content: 'comment content text',
        isdeleted: true,
      },
    ];

    const mockReplyDetail = [
      {
        id: 'reply-111',
        content: 'reply content text',
        date: '2020-11-11',
        username: 'syahran',
        isdeleted: false,
        commentid: 'comment-111',
      },
      {
        id: 'reply-222',
        content: 'reply content text',
        date: '2020-11-12',
        username: 'fadhil',
        isdeleted: true,
        commentid: 'comment-111',
      },
    ];

    const mockLikeCount = [
      {
        commentid: 'comment-111',
      },
      {
        commentid: 'comment-111',
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentDetail));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplyDetail));
    mockLikeRepository.getLikeCountByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLikeCount));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getThreadByIdUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toEqual({
      id: 'thread-123',
      title: 'thread title text',
      body: 'thread title body',
      date: '2020-11-11',
      username: 'rafa',
      comments: [
        {
          id: 'comment-111',
          username: 'syahran',
          date: '2020-11-11',
          content: 'comment content text',
          likeCount: 2,
          replies: [
            {
              id: 'reply-111',
              content: 'reply content text',
              date: '2020-11-11',
              username: 'syahran',
            },
            {
              id: 'reply-222',
              content: '**balasan telah dihapus**',
              date: '2020-11-12',
              username: 'fadhil',
            },
          ],
        },
        {
          id: 'comment-222',
          username: 'fadhil',
          date: '2020-11-11',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockLikeRepository.getLikeCountByThreadId).toBeCalledWith(useCaseParams.threadId);
  });

  it('should handle the case when the thread is not found', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'nonexistent-thread-id',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockLikeRepository.getLikeCountByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getThreadByIdUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toBeNull();

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledTimes(0);
    expect(mockReplyRepository.getReplyByThreadId).toHaveBeenCalledTimes(0);
    expect(mockLikeRepository.getLikeCountByThreadId).toHaveBeenCalledTimes(0);
  });
});
