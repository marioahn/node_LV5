export class LikesService {
  constructor(likesRepository) {
    this.likesRepository = likesRepository
  };

  getOnePost = async (postId) => {
    const post = await this.likesRepository.getOnePost(postId);
    return post
  };

  updateLike = async (userId,postId,aboutLike) => {
    const message = await this.likesRepository.updateLike(userId,postId,aboutLike)
    return message
  };

  getLikedPosts = async (aboutLike) => {
    const likedPosts = await this.likesRepository.getLikedPosts(aboutLike);
    likedPosts.sort((a,b) => b.likes-a.likes);

    return likedPosts;
  };
};
