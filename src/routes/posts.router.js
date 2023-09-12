import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { PostsController } from '../controllers/posts.controller.js';
import { PostsService } from '../services/posts.service.js';
import { PostsRepository } from '../repositories/posts.repository.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 의존성 주입 - for 유닛단위 테스트 - by 팩토리패턴
class PostsFactory {
  static createPostsComponents(prisma) {
    const postsRepository = new PostsRepository(prisma);
    const postsService = new PostsService(postsRepository);
    const postsController = new PostsController(postsService);
    return { postsController };
  }
};
const { postsController } = PostsFactory.createPostsComponents(prisma);


/** 1. 게시글 작성 API */
router.post('/', authMiddleware, postsController.createPost);

/** 2. 게시글 조회 API */
router.get('/', postsController.getPosts);

/** 3. 게시글 상세 조회 API */
router.get('/:postId', postsController.getOnePost);

/** 4. 게시글 수정 API */
router.put('/:postId', authMiddleware, postsController.updatePost);

/** 5. 게시글 삭제 API */
router.delete('/:postId', authMiddleware, postsController.deletePost);



export default router;