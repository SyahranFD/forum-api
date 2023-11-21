class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._replyRepository.verifyReplyExist(useCasePayload.id);
    await this._replyRepository.verifyReplyOwner(useCasePayload.id, useCasePayload.owner);
    await this._replyRepository.deleteReplyById(useCasePayload.id);
  }
}

module.exports = DeleteReplyUseCase;
