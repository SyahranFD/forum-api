class GetThreadByIdUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);

    if (!thread) {
      return null;
    }

    const [comments, replies, likes] = await Promise.all([
      this._commentRepository.getCommentByThreadId(threadId),
      this._replyRepository.getReplyByThreadId(threadId),
      this._likeRepository.getLikeCountByThreadId(threadId),
    ]);

    const mappedReplies = (comment) => {
      const filteredReplies = replies.filter((reply) => reply.commentid === comment.id);
      return filteredReplies.map((reply) => ({
        id: reply.id,
        content: reply.isdeleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      }));
    };

    const filteredLikeCount = (comment) => likes
      .filter((like) => like.commentid === comment.id).length;

    const mappedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.isdeleted ? '**komentar telah dihapus**' : comment.content,
      likeCount: filteredLikeCount(comment),
      replies: mappedReplies(comment),
    }));

    return {
      ...thread,
      comments: mappedComments,
    };
  }
}

module.exports = GetThreadByIdUseCase;

// const filteredLikeCount = (comment) => likes
// .filter((like) => like.commentid === comment.id).length;
