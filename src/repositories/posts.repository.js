export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma
  };

  createPost = async (userId, nickname, title, content) => {
    await this.prisma.posts.create({
      data: {
        UserId: userId,
        Nickname: nickname,
        title,
        content,
        likes: 0
      }
    });
    // return 굳이 필요없을 듯 -> 생성한 데이터 보여주는 게 아니라서. from 명세서
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

  // deletePost
};