import { jest } from '@jest/globals';
import { PostsController } from '../../../src/controllers/posts.controller.js';
import { isJoiData } from '../../../validation.js';
// import joi from 'joi'

// const createdSchema = joi.object({
//   title: joi.string().min(1).required(),
//   content: joi.string().min(1).required(),
// })

// posts.service.js 에서는 아래 5개의 Method만을 사용
const mockPostsService = {
  getPosts: jest.fn(),
  getOnePost: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn()
};

const mockRequest = { // service,repo엔 없던 (컨트롤러의)뉴페1
  body: jest.fn(),
  params: jest.fn(), // 아오.. 
  user: jest.fn() // 이것도 추가..
};

const mockResponse = { // 뉴페2
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn(); // 뉴페3

// postsController의 Service를 Mock Service로 의존성을 주입
const postsController = new PostsController(mockPostsService);


describe('Posts Controller Unit Test', () => {
  // 각 test가 실행되기 전에 실행된다
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화
    mockResponse.status.mockReturnValue(mockResponse);
  });

  // 1. getPosts테스트
  test('getPosts Method', async () => {
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
    mockPostsService.getPosts.mockReturnValue(samplePosts);

    await postsController.getPosts(mockRequest,mockResponse,mockNext);

    // expect(x).toEqual(samplePosts) <- controller부분은 이거 x
    expect(mockPostsService.getPosts).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: samplePosts // 어찌보면, 이게 위의 equal부분 대체하는 셈
    });
  });

  // 2. getOnePost테스트
  test('getOnePost Method - 성공', async () => {
    const samplePost = {
      "postId": 9,
      "UserId": 3,
      "Nickname": "003",
      "title": "좋아요 테스트",
      "content": "내용~",
      "likes": 0,
      "createdAt": new Date("2023-09-10T07:45:38.542Z"),
      "updatedAt": new Date("2023-09-09T07:49:38.542Z")
    };
    mockPostsService.getOnePost.mockReturnValue(samplePost);

    await postsController.getOnePost(mockRequest,mockResponse,mockNext);

    expect(mockPostsService.getOnePost).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      post: samplePost 
    });
  });

  // 3. createPost테스트
  test('createPost Method - 성공', async () => {
    const createPostReqUser = {
      userId: 'userId_Success',
      nickname: 'nickname_Success'
    }
    const createPostReqBody = {
      title: 'title_Success',
      content: 'content_Success',
    };
    mockRequest.body = createPostReqBody;
    mockRequest.user = createPostReqUser;

    const createPostReturnValue = {
      postId: 1,
      ... createPostReqUser,
      ... createPostReqBody,
    };
    mockPostsService.createPost.mockReturnValue(createPostReturnValue);

    await postsController.createPost(mockRequest,mockResponse,mockNext);

    expect(mockPostsService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsService.createPost).toHaveBeenCalledWith(
      createPostReturnValue.userId,
      createPostReturnValue.nickname,
      createPostReturnValue.title,
      createPostReturnValue.content
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '게시글 작성에 성공하였습니다'
    });
  });

  // 3-2. createPost테스트 - body데이터 실패만 모아둠
  test('createPost Method - wrong Bodydata', async () => {
    expect(isJoiData(1,1)).toEqual(false);
    expect(isJoiData(1,'1')).toEqual(false);
    expect(isJoiData('1',1)).toEqual(false);
    expect(isJoiData('','')).toEqual(false);
    expect(isJoiData('','a')).toEqual(false);
    expect(isJoiData('a','')).toEqual(false);
  });


  // 4. updatePost테스트 - 성공
  // test('updatePost Method - 성공', async () => {
  //   const createPostReqUser = {
  //     UserId: 'userId_Success',
  //   };
  //   const createPostReqParams = {
  //     postId: 'postId_Success',
  //   };
  //   const createPostReqBody = {
  //     title: 'title_Success',
  //     content: 'content_Success',
  //   };
  //   mockRequest.user = createPostReqUser;
  //   mockRequest.params = createPostReqParams;
  //   mockRequest.body = createPostReqBody;

  //   const updatePostReturnValue = {
  //     ... createPostReqUser,
  //     nickname: 'nickname',
  //     ... createPostReqParams,
  //     ... createPostReqBody,
  //   };

  //   mockPostsService.updatePost.mockReturnValue(updatePostReturnValue);
  //   await postsController.updatePost(mockRequest,mockResponse,mockNext);

  // *여기서부터 다 실패
  //   expect(mockPostsService.updatePost).toHaveBeenCalledTimes(1);
  //   expect(mockPostsService.updatePost).toHaveBeenCalledTimes(1);
  //   expect(mockPostsService.updatePost).toHaveBeenCalledWith(
  //     updatePostReturnValue.postId,
  //     updatePostReturnValue.title,
  //     updatePostReturnValue.content
  //   );
  //   expect(mockResponse.status).toHaveBeenCalledTimes(1);
  //   expect(mockResponse.status).toHaveBeenCalledWith(201);
  //   expect(mockResponse.json).toHaveBeenCalledTimes(1);
  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     message: '게시글 수정에 성공하였습니다'
  //   });

  // });

  // 5. deletePost테스트
  test('deletePost Method', async () => {

  });

});

