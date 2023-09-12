import { CustomError } from "../errors/customError.js";

export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma
  };

  createPost = async (userId, nickname, title, content) => {
    const createdPost = await this.prisma.posts.create({
      data: {
        UserId: userId,
        Nickname: nickname,
        title,
        content,
        likes: 0
      }
    });
    // return 굳이 필요없을 듯 -> 명세서에서 response는 그냥 message라서
      // 근데, test코드 확인해보려면 필요함.. expect(a).toEqual(mockreturn)에서 a가 undefined되니까
    return createdPost
  };

  getPosts = async () => {
    const posts = await this.prisma.posts.findMany();
    return posts;
  };

  getOnePost = async (postId) => {
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };
    return post;
  };

  updatePost = async (userId,postId,title,content) => {
    // step1: 먼저, 에러체크
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };
    if (post['UserId'] !== userId) { // '!post'조건보다 아래에 있어야 에러x
      throw new CustomError(403,'게시글 수정 권한이 없습니다')
    };

    // step2: 비로소, update 수행
    const updatedPost = await this.prisma.posts.update({
      where: { postId: +postId },
      data: { title, content }
    });

    if (!updatedPost) {
      throw new CustomError(401,'게시글이 정상적으로 수정되지 않았습니다')
    };
    
    return updatedPost
  };

  deletePost = async (userId,postId) => {
    // step1: 먼저, 에러체크
    const post = await this.prisma.posts.findUnique({ where: { postId: +postId } });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };
    if (post.UserId !== userId) { // '!post'조건보다 아래에 있어야 에러x
      throw new CustomError(403,'게시글 삭제 권한이 없습니다')
    };

    // step2: 비로소, delete 수행
    const deletedPost = await this.prisma.posts.delete({
      where: { postId: +postId }
    });

    if (!deletedPost) {
      throw new CustomError(401,'게시글이 정상적으로 삭제되지 않았습니다')
    };

    return deletedPost // test용 return
  };

};