export class CommentsService {
  constructor(commentsRepository) {
    this.commentsRepository = commentsRepository
  };

  createComment = async (userId,postId,nickname,comment) => {
    await this.commentsRepository.createComment(
      userId,postId,nickname,comment
    );
  };

  getComments = async (postId) => {
    const comments = await this.commentsRepository.getComments(postId);
    comments.sort((a,b) => { return b.createdAt - a.createdAt });
    
    return comments.map((comment) => {
      return {
        commentId: comment.commentId,
        UserId: comment.UserId,
        PostId: comment.PostId,
        Nickname: comment.Nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      }
    });
  };

  updateComment = async (postId,userId,commentId,comment) => {
    await this.commentsRepository.updateComment(
      postId,userId,commentId,comment
    );
  };

  deleteComment = async (userId,postId,commentId) => {
    await this.commentsRepository.deleteComment(
      userId,postId,commentId
    );
  };

};