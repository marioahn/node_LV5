import joi from 'joi'

const createdSchema = joi.object({
  title: joi.string().min(1).required(),
  content: joi.string().min(1).required(),
})

export class PostsController {
  constructor(postsService) {
    this.postsService = postsService
  };

  // 1. 게시글 생성
  createPost = async (req, res, next) => {
    try {
      const { userId, nickname } = req.user; 
      const validation = await createdSchema.validateAsync(req.body);
      const { title, content } = validation;

      await this.postsService.createPost(userId, nickname, title, content);
      
      return res.status(201).json({ message: '게시글 작성에 성공하였습니다' });
    } catch (err) {
      next(err)
    }
  };

  // 2. 게시글 전체 조회
  getPosts = async (_,res,next) => {
    try {
      const posts = await this.postsService.getPosts();

      return res.status(200).json({ posts: posts });
    } catch (err) {
      next(err)
    }
  };

  // 3. 게시글 상세 조회
  getOnePost = async (req,res,next) => {
    try {
      const { postId } = req.params;

      const post = await this.postsService.getOnePost(postId);

      return res.status(200).json({ post: post });
    } catch (err) {
      next(err)
    }
  };

  // 4. 게시글 수정
  updatePost = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;
      const validation = await createdSchema.validateAsync(req.body);
      const { title, content } = validation;
      
      await this.postsService.updatePost(userId,postId,title,content);
      
      return res.status(200).json({ message: '게시글을 수정하였습니다' });
    } catch (err) {
      next(err)
    }
  };

  // 5. 게시글 삭제
  deletePost = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;

      await this.postsService.deletePost(userId,postId)

      return res.status(200).json({ message: '게시글을 삭제하였습니다' });
    } catch (err) {
      next(err)
    }
  };
};