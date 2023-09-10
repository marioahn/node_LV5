import joi from 'joi'

const createdSchema = joi.object({
  title: joi.string().min(1).required(),
  content: joi.string().min(1).required(),
})

export class PostsController {
  constructor(postsService) {
    this.postsService = postsService
  };


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


  getPosts = async (_,res,next) => {
    try {
      const posts = await this.postsService.getPosts();

      return res.status(200).json({ posts: posts });
    } catch (err) {
      next(err)
    }
  };


  getOnePost = async (req,res,next) => {
    try {
      const { postId } = req.params;
      const post = await this.postsService.getOnePost(postId);
      if (!post) {
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      return res.status(200).json({ post: post });
    } catch (err) {
      next(err)
    }
  };


  updatePost = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;
      const validation = await createdSchema.validateAsync(req.body);
      const { title, content } = validation;
      
      // 아래코드가 작동되려면, if (!post) { return null }가 service의 getOnePost에 있어야 함
        // 거기는 return 값이 xx.key이기 때문(null.key는 에러)
      const post = await this.postsService.getOnePost(postId); 
      
      if (!post) { 
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };
      if (post['UserId'] !== userId) {
        return res.status(403).json({ errorMessage: '게시글 수정 권한이 없습니다' })
      };

      
      // *의문4
      const updatedPost = await this.postsService.updatePost(postId,title,content);
      
      if (!updatedPost) {
        return res.status(401).json({ errorMessage: '게시글이 정상적으로 수정되지 않았습니다' })
      };
      
      return res.status(200).json({ message: '게시글을 수정하였습니다' });
    } catch (err) {
      next(err)
    }
  };


  deletePost = async (req,res,next) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;

      const post = await this.postsService.getOnePost(postId); 
      if (!post) { 
        return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다' })
      };

      if (post['UserId'] !== userId) {
        return res.status(403).json({ errorMessage: '게시글 삭제 권한이 없습니다' })
      };

      const deletedPost = await this.postsService.deletePost(postId)

      if (!deletedPost) {
        return res.status(401).json({ errorMessage: '게시글이 정상적으로 수정되지 않았습니다' })
      };

      return res.status(200).json({ message: '게시글을 삭제하였습니다' });
    } catch (err) {
      next(err)
    }
  };
};