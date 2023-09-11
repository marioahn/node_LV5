import express from "express";
import PostsRouter from './posts.router.js';
import CommentsRouter from './comments.router.js';
import LikesRouter from './likes.router.js';

const router = express.Router();


router.use('/posts', LikesRouter); // 아래와 같이 쓰면, api 경로 꼬임(:postId)
router.use('/posts', [PostsRouter,CommentsRouter]);


export default router;