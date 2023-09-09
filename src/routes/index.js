import express from "express";
import PostsRouter from './posts.router.js';
import CommentsRouter from './comments.router.js';
import LikesRouter from './likes.router.js';

const router = express.Router();


router.use('/posts', LikesRouter);
router.use('/posts', [PostsRouter,CommentsRouter]);


export default router;