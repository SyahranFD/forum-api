class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);

    if (!thread) {
      return null;
    }

    const [comments, replies] = await Promise.all([
      this._commentRepository.getCommentByThreadId(threadId),
      this._replyRepository.getReplyByThreadId(threadId),
    ]);

    const mapReply = (comment) => {
      const filteredReplies = replies.filter((reply) => reply.commentid === comment.id);
      return filteredReplies.map((reply) => ({
        id: reply.id,
        content: reply.isdeleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      }));
    };

    const processedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.isdeleted ? '**komentar telah dihapus**' : comment.content,
      replies: mapReply(comment),
    }));

    return {
      ...thread,
      comments: processedComments,
    };
  }
}

module.exports = GetThreadByIdUseCase;
