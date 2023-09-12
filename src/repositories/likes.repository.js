import { CustomError } from "../errors/customError.js";

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

  updateLike = async (userId,postId,aboutLike) => {
    // step0.게시글,해당 유저 먼저 찾기
    const post = await this.prisma.posts.findUnique({ 
      where: { postId: +postId }
    });
    if (!post) {
      throw new CustomError(404,'게시글이 존재하지 않습니다')
    };

    // step1. 좋아요를 누르지 않은 상태라면? -> 추가하기
    if (!aboutLike.includes(`${postId} `)) { // 공백으로 간 게시글id구분 -> '1 2 3 23 ' vs ('12323')
      const changedLike = post.likes+1
      const aboutLike2 = aboutLike + postId + ' '
      // 1-1: 유저정보 업데이트(aboutLike)
      await this.prisma.users.update({
        where: { userId: userId },
        data: { aboutLike: aboutLike2 }
      });
      // 1-2: 게시글정보 업데이트(likes)
      await this.prisma.posts.update({
        where: { postId: +postId },
        data: { likes: changedLike }
      });
      return '등록';
    }
    
    // step2. 좋아요를 이미 누른 상태라면? -> 취소하기
    else {
      const changedLike = post.likes-1
      const aboutLike2 = aboutLike.replaceAll(`${postId} `, ''); // postId+' '으로 찾기
      // 2-1: 유저정보 업데이트(aboutLike)
      await this.prisma.users.update({
        where: { userId: userId },
        data: { aboutLike: aboutLike2 }
      });
      // 2-2: 게시글정보 업데이트(likes)
      await this.prisma.posts.update({
        where: { postId: +postId },
        data: { likes: changedLike }
      });
      return '취소';
    }
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

