export class LikesController {
  constructor(likesService) {
    this.likesService = likesService
  };

  // *의문6:확실히 리팩토링 필요할 것 같음 -> 총 3개를 왔다갔다,왔다갔다,왔다갔다 함
    // layered계층으로 하면, 로직을 더 신경 써야 할듯
  pushLikeButton = async (req,res,next) => {
    try {
      const { postId } = req.params;
      const { userId, aboutLike } = req.user;

      const post = await this.likesService.getOnePost(postId);
      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      // step1. 좋아요를 누르지 않은 상태라면? -> 추가하기
      if (!aboutLike.includes(`${postId} `)) {
        // 공백으로 간 게시글id구분 -> '1 2 3 23 ' vs ('12323')
        const changedLike = post.likes+1
        const aboutLike2 = aboutLike + postId + ' '
        await this.likesService.updateUserLike(userId,aboutLike2);
        await this.likesService.updatePostLike(postId,changedLike);

        return res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다' });
      }
      // step2. 좋아요를 이미 누른 상태라면? -> 취소하기
      else {
        const changedLike = post.likes-1
        const aboutLike2 = aboutLike.replaceAll(`${postId} `, ''); // postId+' '으로 찾기
        await this.likesService.updateUserLike(userId,aboutLike2);
        await this.likesService.updatePostLike(postId,changedLike);

        return res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다' });
      }
    } catch (err) {
      next(err)
    }
  };

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

