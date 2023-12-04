const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

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
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'comment content text',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLikeByCommentId function', () => {
    it('should return like correctly', async () => {
      // Arrange
      const likeComment = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedLikeComment = await likeRepositoryPostgres
        .addLikeByCommentId(likeComment.commentId, likeComment.owner);

      // Assert
      expect(addedLikeComment).toEqual(1);
    });
  });

  describe('deleteLikeByCommentId function', () => {
    it('should delete like correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLikeByCommentId('comment-123', 'user-123');
      const like = await LikesTableTestHelper.findLikeById('like-123');

      // Assert
      expect(like.length).toEqual(0);
    });
  });

  describe('getLikeByThreadId function', () => {
    it('should return like by thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-111',
        username: 'rafa',
        password: 'rafapass',
        fullname: 'Rafa Syahran',
      });

      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-111', commentId: 'comment-123', owner: 'user-111' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikeCountByThreadId('thread-123');

      // Assert
      expect(like.length).toEqual(2);
    });
  });

  describe('verifyLikeExistAndOwner function', () => {
    it('should return 1 when comment is liked', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likeUnlikeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLike = await likeUnlikeRepositoryPostgres.verifyLikeExistAndOwner('comment-123', 'user-123');

      // Assert
      expect(isLike).toEqual(1);
    });

    it('should return 0 when comment is not liked', async () => {
      // Arrange
      const likeUnlikeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await likeUnlikeRepositoryPostgres.verifyLikeExistAndOwner({ commentId: 'comment-123', userId: 'user-123' });

      // Assert
      expect(isLiked).toEqual(0);
    });
  });
});
