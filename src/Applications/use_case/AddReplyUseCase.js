const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParams) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyThreadExist(useCaseParams.threadId);
    await this._commentRepository.verifyCommentExist(useCaseParams.commentId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
