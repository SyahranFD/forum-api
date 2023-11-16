class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const thread = await this._threadRepository.getThreadById(useCaseParams);
    const comments = await this._commentRepository.getCommentByThreadId(useCaseParams);
    const replies = await this._replyRepository.getReplyByThreadId(useCaseParams);

    const detailThread = this._mapToDetailThread(thread, comments, replies);
    return detailThread;
  }

  _mapToDetailThread(thread, comments, replies) {
    const commentMap = new Map();

    comments.forEach((comment) => {
      const commentDetail = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.isDeleted ? '**komentar telah dihapus**' : comment.content,
        isDeleted: comment.isDeleted,
        replies: [],
      };

      commentMap.set(comment.id, commentDetail);
    });

    replies.forEach((reply) => {
      const replyDetail = {
        id: reply.id,
        content: reply.isDeleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
        isDeleted: reply.isDeleted,
      };

      const commentDetail = commentMap.get(reply.commentId);
      commentDetail.replies.push(replyDetail);
    });

    const detailThreadPayload = {
      id: thread[0].id,
      title: thread[0].title,
      body: thread[0].body,
      date: thread[0].date,
      username: thread[0].username,
    };

    const mappedThread = {
      ...detailThreadPayload,
      comments: Array.from(commentMap.values()).map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        })),
      })),
    };

    return mappedThread;
  }
}

module.exports = GetThreadByIdUseCase;
