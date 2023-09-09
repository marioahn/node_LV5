
export class CommentsService {
  constructor(commentsRepository) {
    this.commentsRepository = commentsRepository
  };

  getOnePost = async (postId) => {
    const post = await this.commentsRepository.getOnePost(postId);
    if (!post) { return null }
    
    return post // 여기선 가공 필요없음 -> 걍 빈게시글 존재 여부 확인용(에러)
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

  updateComment = async (userId,commentId,comment) => {
    const updatedComment = await this.commentsRepository.updateComment(
      userId,commentId,comment
    );
    return updatedComment;
  };

  deleteComment = async (userId,postId,commentId) => {
    const deletedComment = await this.commentsRepository.deleteComment(
      userId,postId,commentId
    );
    return deletedComment;
  };

};