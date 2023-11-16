const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
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

    const mockThreadDetail = new DetailThread({
      id: useCaseParams.threadId,
      title: 'thread title text',
      body: 'thread title body',
      date: '2020-11-11',
      username: 'rafa',
      comments: [],
    });

    const mockCommentDetail = [
      new DetailComment(
        {
          id: 'comment-111',
          username: 'syahran',
          date: '2020-11-11',
          content: 'comment content text',
          isDeleted: false,
          replies: [],
        },
      ),
      new DetailComment(
        {
          id: 'comment-222',
          username: 'fadhil',
          date: '2020-11-11',
          content: 'comment content text',
          isDeleted: true,
          replies: [],
        },
      ),
    ];

    const mockReplyDetail = [
      new DetailReply(
        {
          id: 'reply-111',
          content: 'reply content text',
          date: '2020-11-11',
          username: 'syahran',
          isDeleted: false,
          commentId: 'comment-111',
        },
        {
          id: 'reply-222',
          content: 'reply content text',
          date: '2020-11-11',
          username: 'fadhil',
          isDeleted: true,
          commentId: 'comment-222',
        },
      ),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve([mockThreadDetail]));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentDetail));
    mockReplyRepository.getReplyByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplyDetail));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadByIdUseCase.execute(useCaseParams.threadId);

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
          replies: [
            {
              id: 'reply-111',
              content: 'reply content text',
              date: '2020-11-11',
              username: 'syahran',
            },
          ],
        },
        {
          id: 'comment-222',
          username: 'fadhil',
          date: '2020-11-11',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCaseParams.threadId);
  });
});
