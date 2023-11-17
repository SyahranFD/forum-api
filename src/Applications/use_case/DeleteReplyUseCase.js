class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    return this._replyRepository.deleteReplyById(useCasePayload.id);
  }
}

module.exports = DeleteReplyUseCase;
