export class LikesRepository {
  constructor(prisma) {
    this.prisma = prisma
  };
  
  getOnePost = async (postId) => {
    const post = await this.prisma.posts.findUnique({ 
      where: { postId: +postId }
    });
    if (!post) { return null };

    return post;
  };

  getAllPosts = async () => { // 좋아요 게시글api의 service에서만 사용됨
    const posts = await this.prisma.posts.findMany();
    return posts
  };

  updateUserLike = async (userId,aboutLike2) => {
    await this.prisma.users.update({
      where: { userId: userId },
      data: { aboutLike: aboutLike2 }
    });
  };

  updatePostLike = async (postId,changedLike) => {
    await this.prisma.posts.update({
      where: { postId: +postId },
      data: { likes: changedLike }
    });
  };

  getLikedPosts = async (aboutLike) => {
    const arr = aboutLike.split(' ')
    const likedPosts = []
    
    for (let i=0; i<arr.length-1; i++) {
      const post = await this.prisma.posts.findUnique({
        where: { postId: +arr[i]},
        select: {
          postId: true,
          UserId: true,
          Nickname: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          likes: true
        }
      });
      likedPosts.push(post);
    };

    return likedPosts;
  };
};

