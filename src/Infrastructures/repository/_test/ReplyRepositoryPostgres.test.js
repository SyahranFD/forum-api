const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
      title: 'thread title text',
      body: 'thread body text',
    });
    await CommentsTableTestHelper.addComment({
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'comment content text',
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'reply content text',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        owner: 'user-123',
        content: 'reply content text',
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-???', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply is not owned by user', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'reply content text',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-222')).rejects.toThrowError(AuthorizationError);
    });

    it('should delete reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'reply content text',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');
      const reply = await RepliesTableTestHelper.getReplyById('reply-123');

      // Assert
      expect(reply[0].is_deleted).toEqual(true);
    });
  });
  describe('getReplyByThreadId function', () => {
    it('should return replies by thread id correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-111',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'reply content text',
        isdeleted: false,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-222',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'reply content text',
        isdeleted: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getReplyByThreadId('thread-123');

      const mappedReplies = replies.map((reply) => {
        const { commentid, isdeleted, ...rest } = reply;
        return rest;
      });

      // Assert
      expect(mappedReplies).toEqual([
        {
          id: 'reply-111',
          content: 'reply content text',
          date: expect.anything(),
          username: 'dicoding',
        },
        {
          id: 'reply-222',
          content: 'reply content text',
          date: expect.anything(),
          username: 'dicoding',
        },
      ]);
    });
  });
});
