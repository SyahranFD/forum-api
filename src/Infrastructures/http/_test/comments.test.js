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

  beforeAll(async () => {
    const requestPayloadAuthentication = {
      username: 'rafa',
      password: 'rafapassword',
    };

    const requestPayloadThread = {
      title: 'thread title text',
      body: 'thread body text',
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'rafa',
        password: 'rafapassword',
        fullname: 'Rafa Syahran',
      },
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
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content text',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
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
      const requestPayload = {

      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
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
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });
});
