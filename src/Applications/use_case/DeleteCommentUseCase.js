const AddComment = require('../../Domains/comments/entities/AddComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    return this._commentRepository.deleteCommentById(useCasePayload.id);
  }
}

module.exports = DeleteCommentUseCase;
