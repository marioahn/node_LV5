export class CommentsController {
  constructor(commentsService) {
    this.commentsService = commentsService
  };
  
  // 1. 댓글 생성
  createComment = async (req, res, next) => {
    try {
      const { userId, nickname } = req.user; 
      const { postId } = req.params;
      const { comment } = req.body;

      // body데이터 관련 에러는 controller에서 바로 처리
      if (!comment) {
        return res.status(412).json({ errorMessage: '댓글을 입력해주세요' })
      };

      await this.commentsService.createComment(userId,postId,nickname,comment);
      
      return res.status(201).json({ message: '댓글 작성에 성공하였습니다' });
    } catch (err) {
      next(err)
    }
  };

  // 2. 댓글 조회
  getComments = async (req,res,next) => {
    try {
      const { postId } = req.params;

      const comments = await this.commentsService.getComments(postId);
      
      return res.status(200).json({ comments: comments });
    } catch (err) {
      next(err)
    }
  };

  // 3. 댓글 수정
  updateComment = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId, commentId } = req.params;
      const { comment } = req.body;
      
      // body데이터 관련 에러는 controller
      if (!comment) {
        return res.status(412).json({ errorMessage: '댓글 내용을 입력해주세요' })
      };

      await this.commentsService.updateComment(postId,userId,commentId,comment);

      return res.status(200).json({ message: '댓글을 수정하였습니다' });
    } catch (err) {
      next(err)
    }
  };

  // 4. 댓글 생성
  deleteComment = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId, commentId } = req.params;

      await this.commentsService.deleteComment(userId,postId,commentId);
      
      return res.status(200).json({ message: '댓글을 삭제하였습니다' });
    } catch (err) {
      next(err)
    }
  };

};