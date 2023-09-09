export class LikesService {
  constructor(likesRepository) {
    this.likesRepository = likesRepository
  };

  getOnePost = async (postId) => {
    const post = await this.likesRepository.getOnePost(postId);
    return post
  };

  updateUserLike = async (userId,aboutLike2) => {
    await this.likesRepository.updateUserLike(userId,aboutLike2)
  };

  updatePostLike = async (postId,changedLike) => {
    await this.likesRepository.updatePostLike(postId,changedLike)
  };

  getLikedPosts = async (aboutLike) => {
    const likedPosts = await this.likesRepository.getLikedPosts(aboutLike);
    likedPosts.sort((a,b) => b.likes-a.likes);

    return likedPosts;
  };
};
