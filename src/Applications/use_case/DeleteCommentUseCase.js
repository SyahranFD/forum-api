class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentExist(useCasePayload.id);
    await this._commentRepository.verifyCommentOwner(useCasePayload.id, useCasePayload.owner);
    await this._commentRepository.deleteCommentById(useCasePayload.id);
  }
}

module.exports = DeleteCommentUseCase;
