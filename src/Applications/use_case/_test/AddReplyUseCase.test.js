const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
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

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      owner: useCaseAuthCredential.owner,
      content: 'reply content text',
    }));

    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      commentId: useCaseParams.commentId,
      owner: useCaseAuthCredential.owner,
      content: useCasePayload.content,
    }));
  });
});
