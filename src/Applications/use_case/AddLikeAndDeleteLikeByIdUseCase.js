class AddLikeAndDeleteLikeByIdUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    await this._threadRepository.verifyThreadExist(useCaseParams.threadId);
    await this._commentRepository.verifyCommentExist(useCaseParams.commentId);
    const isLike = await this._likeRepository.verifyLikeExistAndOwner(
      useCaseParams.commentId,
      useCaseParams.owner,
    );

    if (isLike > 0) {
      return this._likeRepository.deleteLikeByCommentId(
        useCaseParams.commentId,
        useCaseParams.owner,
      );
    }

    return this._likeRepository.addLikeByCommentId(
      useCaseParams.commentId,
      useCaseParams.owner,
    );
  }
}

module.exports = AddLikeAndDeleteLikeByIdUseCase;
