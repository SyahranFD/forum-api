const AddLikeAndDeleteLikeByIdUseCase = require('../../../../Applications/use_case/AddLikeAndDeleteLikeByIdUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeByCommentIdHandler = this.putLikeByCommentIdHandler.bind(this);
  }

  async putLikeByCommentIdHandler(request, h) {
    const addLikeUseCase = this._container.getInstance(AddLikeAndDeleteLikeByIdUseCase.name);
    const { id: credentialId } = request.auth.credentials;

    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: credentialId,
    };

    await addLikeUseCase.execute(useCasePayload, request.params);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
