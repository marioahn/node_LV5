import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { CommentsController } from '../controllers/comments.controller.js';
import { CommentsService } from '../services/comments.service.js';
import { CommentsRepository } from '../repositories/comments.repository.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const commentsRepository = new CommentsRepository(prisma);
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);


/** 1. 댓글 작성 API */
router.post('/:postId/comments', authMiddleware, commentsController.createComment);

/** 2. 댓글 (전체)조회 API */
  // 해당 post(by postId)에 작성된 '전체'댓글 조회
router.get('/:postId/comments', commentsController.getComments);

/** 3.  수정 API */
router.put('/:postId/comments/:commentId', authMiddleware, commentsController.updateComment);

// /** 4. 게시글 삭제 API */
router.delete('/:postId/comments/:commentId', authMiddleware, commentsController.deleteComment);



export default router;