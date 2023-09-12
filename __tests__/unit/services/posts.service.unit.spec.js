import { expect, jest } from '@jest/globals';
import { PostsService } from '../../../src/services/posts.service.js';

// PostsRepository는 아래의 5개 메서드만 지원하고 있다
let mockPostsRepository = { // 여긴 service니, mockPrisma가 아니라 mockRepo!
  getPosts: jest.fn(),
  getOnePost: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입한다
let postsService = new PostsService(mockPostsRepository);

describe('Posts Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행된다
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화한다
  })

    // 1. createPost테스트
    test('createPost Success', async () => {
      const mockReturn = 'mockReturn';
      mockPostsRepository.createPost.mockReturnValue(mockReturn);
  
      const [tmpUserId, tmpNickName, tmpTitle, tmpContent] = ['tmpU', 'tmpN', 'tmpT', 'tmpC']
      const createdPost = await postsService.createPost(
        tmpUserId, tmpNickName, tmpTitle, tmpContent
      );
  
      expect(createdPost).toEqual(mockReturn);
      expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.createPost).toHaveBeenCalledWith('tmpU', 'tmpN', 'tmpT', 'tmpC');
    });

  // 2. getPosts테스트
  test('getPosts Success', async () => {
    const samplePosts = [
      {
        "postId": 9,
        "UserId": 3,
        "Nickname": "003",
        "title": "좋아요 테스트",
        "likes": 0,
        "createdAt": new Date("2023-09-10T07:45:38.542Z"),
        "updatedAt": new Date("2023-09-09T07:49:38.542Z")
      },
      {
        "postId": 7,
        "UserId": 3,
        "Nickname": "003",
        "title": "수정",
        "likes": 1,
        "createdAt": new Date("2023-09-15T07:47:15.980Z"),
        "updatedAt": new Date("2023-09-09T07:49:17.585Z")
      }
    ];

    mockPostsRepository.getPosts.mockReturnValue(samplePosts);
    const posts = await postsService.getPosts();
  
    expect(posts).toEqual(samplePosts.sort((a,b) => {return b.createdAt-a.createdAt})); 
    expect(mockPostsRepository.getPosts).toHaveBeenCalledTimes(1);
  });

  // 3. getOnePosts테스트
  test('getOnePosts Success', async () => {
    const samplePost = {
      "postId": 9,
      "UserId": 3,
      "Nickname": "003",
      "title": "좋아요 테스트",
      "content": "내용~",
      "likes": 0,
      "createdAt": "2023-09-10T07:45:38.542Z",
      "updatedAt": "2023-09-09T07:49:38.542Z"
    };
    mockPostsRepository.getOnePost.mockReturnValue(samplePost);
    
    const tmpPostId = '1'
    const post = await postsService.getOnePost(tmpPostId);

    expect(post).toEqual(samplePost);
    expect(mockPostsRepository.getOnePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.getOnePost).toHaveBeenCalledWith(tmpPostId);
  });

  // 4. updatePost테스트
  test('updatePost Success', async () => {
    const mockReturn = 'mockReturn';
    mockPostsRepository.updatePost.mockReturnValue(mockReturn);

    const updatedPost = await postsService.updatePost(
      1,'1','tmpTitle','tmpContent' // UserId,postId,title,content
    );

    expect(updatedPost).toEqual(mockReturn);
    expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.updatePost).toHaveBeenCalledWith(1,'1','tmpTitle','tmpContent');

  });

  // 5. deletePost테스트
  test('deletePost Success', async () => {
    const mockReturn = 'mockReturn';
    mockPostsRepository.deletePost.mockReturnValue(mockReturn);

    const deletedPost = await postsService.deletePost(1,'1'); // userId, postId

    expect(deletedPost).toEqual(mockReturn);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(1,'1');
  });
});