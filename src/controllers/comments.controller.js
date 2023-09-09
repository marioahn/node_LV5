export class CommentsController {
  constructor(commentsService) {
    this.commentsService = commentsService
  };
  

  createComment = async (req, res, next) => {
    try {
      const { userId, nickname } = req.user; 
      const { postId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(412).json({ errorMessage: '댓글을 입력해주세요' })
      };

      // *의문5
      const post = await this.commentsService.getOnePost(postId);
      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      await this.commentsService.createComment(userId,postId,nickname,comment);
      
      return res.status(201).json({ message: '댓글 작성에 성공하였습니다' });
    } catch (err) {
      next(err)
    }
  };


  getComments = async (req,res,next) => {
    try {
      const { postId } = req.params;

      const post = await this.commentsService.getOnePost(postId);
      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };
  
      const comments = await this.commentsService.getComments(postId);
      if (comments.length === 0) {
        return res.status(400).json({ errorMessage: '아직 작성한 댓글이 없습니다' })
      };

      return res.status(200).json({ comments: comments });
    } catch (err) {
      next(err)
    }
  };

  updateComment = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId, commentId } = req.params;
      const { comment } = req.body;
      
      if (!comment) {
        return res.status(412).json({ errorMessage: '댓글 내용을 입력해주세요' })
      };

      const post = await this.commentsService.getOnePost(postId);
      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      const updatedComment = await this.commentsService.updateComment(userId,commentId,comment);
      console.log(updatedComment)
      // 이거는 repo에서 return값 2개(하나는 정상, 하나는 여기에 들어갈 커스텀문자)로 해결
      if (updatedComment === '댓글검색이 안됨') { 
        return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다' })
      };

      // repo에서 return 값 1개 더 추가함(총 3개 케이스)
      if (updatedComment === '내가 작성한 댓글이 아님') {
        return res.status(403).json({ errorMessage: '댓글의 수정 권한이 없습니다' })
      };
      
      return res.status(200).json({ message: '댓글을 수정하였습니다' });
    } catch (err) {
      next(err)
    }
  };

  // *updateComment와 에러처리 방식이 다름 -> 어느것이 나은가?
  deleteComment = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId, commentId } = req.params;
      const post = await this.commentsService.getOnePost(postId);

      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      await this.commentsService.deleteComment(userId,postId,commentId);
      
      return res.status(200).json({ message: '댓글을 삭제하였습니다' });
    } catch (err) {
      next(err)
    }
  };


};