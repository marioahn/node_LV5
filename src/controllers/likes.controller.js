export class LikesController {
  constructor(likesService) {
    this.likesService = likesService
  };

  // 1. 좋아요버튼 누르기(+-)
  pushLikeButton = async (req,res,next) => {
    try {
      const { postId } = req.params;
      const { userId, aboutLike } = req.user;
      
      const message = await this.likesService.updateLike(userId,postId,aboutLike); // 등록 or 취소

      return res.status(200).json({ message: `게시글의 좋아요를 ${message}하였습니다` });
    } 
    catch (err) {
      next(err)
    }
  };

  // 2. 좋아요 눌러진 게시글 전체 조회
  getLikedPosts = async (req,res,next) => {
    try {
      const { aboutLike } = req.user;
      const likedPosts = await this.likesService.getLikedPosts(aboutLike);

      return res.status(200).json({ posts: likedPosts});
    } catch (err) {
      next(err)
    }
  };
};

