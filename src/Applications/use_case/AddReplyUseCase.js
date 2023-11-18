const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParams) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyThreadExist(useCaseParams.threadId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
