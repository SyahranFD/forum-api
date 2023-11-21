const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

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
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'comment content text',
      }));
    });
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-???')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-???', 'user-222')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply is not owned by user', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-222')).rejects.toThrowError(AuthorizationError);
    });

    it('should delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');

      // Assert
      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments by thread id correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
        isdeleted: false,
        date: '2022-11-11',
        replies: [],
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-222',
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'comment content text',
        isdeleted: false,
        date: '2022-11-12',
        replies: [],
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      const mappedComments = comments.map((comment) => {
        const { isdeleted, ...rest } = comment;
        return rest;
      });

      // Assert
      expect(mappedComments).toEqual([
        {
          id: 'comment-111',
          username: 'dicoding',
          date: expect.anything(),
          content: 'comment content text',
          replies: [],
        },
        {
          id: 'comment-222',
          username: 'dicoding',
          date: expect.anything(),
          content: 'comment content text',
          replies: [],
        },
      ]);
    });
  });
});
