import { PostsRepository } from '../repositories/posts.repository.js';
import { prisma } from '../utils/prisma/index.js'

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

      // *의문5 - 근데, 그러면 의존성 깨지긴 하는데.. 에러 처리 관련 코드라서 괜찮나?
        // 그냥, 직접 prisma로 불러오면 comments.service,repo에 함수 안 써도 됨
        // 심지어 getOnePost로 post에 이미 있는데, 여기서도 똑같이 중복해서 작성할 필요가 있나?
        // 갑자기 controller에서 prisma나오니까 좀 위화감이..
      // const post = await this.commentsService.getOnePost(postId);
      const post  = await prisma.posts.findUnique({ where: { postId: +postId } });

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
    // deleteComment는 controller가 아닌, repo에서 throw new Error를 하였고, 에러미들웨어에서 나머지.
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