import { CustomError } from "../errors/customError.js";

export class CommentsRepository {
  constructor(prisma) {
    this.prisma = prisma
  };

  getComments = async (postId) => {
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };

    const comments = await this.prisma.comments.findMany({
      where: { PostId: +postId }
    });

    if (comments.length === 0) {
      throw new CustomError(404,'아직 작성한 댓글이 없습니다')
    };

    return comments;
  };

  createComment = async (userId,postId,nickname,comment) => {
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };

    await this.prisma.comments.create({
      data: {
        UserId: userId,
        PostId: +postId,
        Nickname: nickname,
        comment
      }
    });
  };

  updateComment = async (postId,userId,commentId,comment) => {
    // 에러체크1
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };
    
    // 에러체크2
    const commentCheck = await this.prisma.comments.findUnique({
      where: { commentId: +commentId }
    });
    if (!commentCheck) {
      throw new CustomError(404,'댓글이 존재하지 않습니다')
    };
    if (commentCheck.UserId !== userId) {
      throw new CustomError(403,'댓글의 수정권한이 없습니다')
    }

    // 위 통과했으면, 비로소 여기서 댓글update 수행
    await this.prisma.comments.update({
      where: { commentId: +commentId },
      data: { comment }
    });
  };

  deleteComment = async (userId,postId,commentId) => {
    // 에러체크1
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };

    // 에러체크2
    const commentCheck = await this.prisma.comments.findUnique({
      where: { commentId: +commentId }
    });
    if (!commentCheck) { 
      throw new CustomError(404,'댓글이 존재하지 않습니다')
    };
    if (commentCheck.UserId !== userId) {
      throw new CustomError(403,'댓글의 삭제 권한이 없습니다')
    };

    // 여기까지 통과되면 비로소 댓글 delete 수행
    await this.prisma.comments.delete({
      where: { PostId: +postId, commentId: +commentId },
    });
  };


}