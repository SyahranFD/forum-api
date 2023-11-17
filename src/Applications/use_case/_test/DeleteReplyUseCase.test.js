const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
    };

    const useCaseAuthCredential = {
      owner: 'user-123',
    };

    const useCasePayload = {
      id: 'reply-123',
      commentId: useCaseParams.commentId,
      owner: useCaseAuthCredential.owner,
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
  });
});
