export class CommentsRepository {
  constructor(prisma) {
    this.prisma = prisma
  };

  getOnePost = async (postId) => {
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    return post;
  };

  createComment = async (userId,postId,nickname,comment) => {
    await this.prisma.comments.create({
      data: {
        UserId: userId,
        PostId: +postId,
        Nickname: nickname,
        comment
      }
    });
  };

  getComments = async (postId) => {
    const comments = await this.prisma.comments.findMany({
      where: { PostId: +postId }
    });
    return comments;
  };

  updateComment = async (userId,commentId,comment) => {
    // 에러처리용 변수 - isExistComment, isYourComment
    const isExistComment = await this.prisma.comments.findUnique({ where: { commentId: +commentId } })
    if (!isExistComment) { return '댓글검색이 안됨' };
    const isYourComment = await this.prisma.comments.findUnique({ where: { UserId: userId,commentId: +commentId } });
    if (!isYourComment) { return '내가 작성한 댓글이 아님'}

    // 위 통과했으면, 이제서야 여기서 update수행
    const updatedComment = await this.prisma.comments.update({
      where: { commentId: +commentId },
      data: { comment }
    });
    return updatedComment;
  };

  deleteComment = async (userId,postId,commentId) => {
    const isExistComment = await this.prisma.comments.findUnique({ where: { commentId: +commentId } })
    // 아래 2개 if문은 에러처리미들웨어에서 res.status.json형태로 처리 가능
    if (!isExistComment) { 
      throw new Error('댓글이 존재하지 않습니다') // res.status(412).json~형태는 여기서 불가
    }
      // isExistComment는 존재하는데, userId가 서로 다른 경우
    if (isExistComment['UserId'] !== userId) {
      throw new Error('댓글의 수정 권한이 없습니다')
    };

    // 여기까지 통과되면 비로서 delete수행
    const deletedComment = await this.prisma.comments.delete({
      where: { PostId: +postId,commentId: +commentId },
    });
    return deletedComment;
  };


}