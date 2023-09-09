import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { LikesController } from '../controllers/likes.controller.js';
import { LikesService } from '../services/likes.service.js';
import { LikesRepository } from '../repositories/likes.repository.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const likesRepository = new LikesRepository(prisma);
const likesService = new LikesService(likesRepository);
const likesController = new LikesController(likesService);


/** 1. 게시글 좋아요 +- API */
router.put('/:postId/like', authMiddleware, likesController.pushLikeButton);

/** 2. 좋아요 게시글 조회 API */
router.get('/like', authMiddleware, likesController.getLikedPosts);

export default router;