export class PostsService {
  constructor(postsRepository) {
    this.postsRepository = postsRepository
  };

  createPost = async (userId,nickname,title,content) => {
    const createdPost = await this.postsRepository.createPost(
      userId, nickname, title, content
    );
    return createdPost
  };

  getPosts = async () => {
    const posts = await this.postsRepository.getPosts();
    posts.sort((a,b) => { return b.createdAt - a.createdAt });
    
    return posts.map((post) => {
      return {
        postId: post.postId,
        UserId: post.UserId,
        Nickname: post.Nickname,
        title: post.title,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }
    });
  };

  getOnePost = async (postId) => {
    const post = await this.postsRepository.getOnePost(postId);
    
    return {
      postId: post.postId,
      UserId: post.UserId,
      Nickname: post.Nickname,
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  };

  updatePost = async (userId,postId,title,content) => {
    const updatedPost = await this.postsRepository.updatePost(userId,postId,title,content);
    return updatedPost
  };

  deletePost = async (userId,postId) => {
    const deletedPost = await this.postsRepository.deletePost(userId,postId);
    return deletedPost
  }

}