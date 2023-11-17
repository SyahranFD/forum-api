const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
  let responseJsonAuthentication;
  let accessToken;
  let responseJsonThread;
  let threadId;
  let responseJsonComment;
  let commentId;

  beforeEach(async () => {
    // Arrange
    const requestPayloadUser = {
      username: 'rafa',
      password: 'rafapassword',
      fullname: 'Rafa Syahran',
    };

    const requestPayloadAuthentication = {
      username: 'rafa',
      password: 'rafapassword',
    };

    const requestPayloadThread = {
      title: 'thread title text',
      body: 'thread body text',
    };

    const requestPayloadComment = {
      content: 'comment content text',
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayloadUser,
    });

    // add accessToken
    const responseAuthentication = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayloadAuthentication,
    });

    responseJsonAuthentication = JSON.parse(responseAuthentication.payload);
    accessToken = responseJsonAuthentication.data.accessToken;

    // add thread
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayloadThread,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    responseJsonThread = JSON.parse(responseThread.payload);
    threadId = responseJsonThread.data.addedThread.id;

    // add comment
    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayloadComment,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    responseJsonComment = JSON.parse(responseComment.payload);
    commentId = responseJsonComment.data.addedComment.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply content text',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
    });

    // it('should response 404 when thread not found', async () => {
    //   // Arrange
    //   const requestPayload = {
    //     content: 'comment content text',
    //   };

    //   const server = await createServer(container);

    //   // Action
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/threads/???/comments',
    //     payload: requestPayload,
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(404);
    //   expect(responseJson.status).toEqual('fail');
    //   expect(responseJson.message).toEqual('thread tidak ditemukan');
    // });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: ['not string'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and persisted delete reply', async () => {
      // Arrange
      const requestPayloadReply = {
        content: 'reply content text',
      };

      const server = await createServer(container);

      // Action
      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJsonReply = JSON.parse(responseReply.payload);
      const replyId = responseJsonReply.data.addedReply.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 403 when user is not the owner of reply', async () => {
      // Arrange
      const requestPayloadUserSecond = {
        username: 'fadhil',
        password: 'fadhilpassword',
        fullname: 'Fadhil Dafanindra',
      };

      const requestPayloadAuthenticationSecond = {
        username: 'fadhil',
        password: 'fadhilpassword',
      };

      const requestPayloadReply = {
        content: 'reply content text',
      };

      const server = await createServer(container);

      // Action
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUserSecond,
      });

      // add accessToken
      const responseAuthenticationSecond = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayloadAuthenticationSecond,
      });

      const responseJsonAuthenticationSecond = JSON.parse(responseAuthenticationSecond.payload);
      const accessTokenSecond = responseJsonAuthenticationSecond.data.accessToken;

      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayloadReply,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJsonReply = JSON.parse(responseReply.payload);
      const replyId = responseJsonReply.data.addedReply.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenSecond}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
