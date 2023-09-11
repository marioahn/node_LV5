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
    return post;
  };

  updatePost = async (postId, title, content) => {
    const updatedPost = await this.prisma.posts.update({
      where: { postId: +postId },
      data: { title, content }
    });
    return updatedPost;
  };

  deletePost = async (postId) => {
    const deletedPost = await this.prisma.posts.delete({
      where: { postId: +postId }
    });
    return deletedPost;
  };
};