import { expect, jest } from '@jest/globals';
import { PostsRepository } from '../../../src/repositories/posts.repository';

let mockPrisma = {
  posts: {
    findMany: jest.fn(), // jest.fn() = mock객체 만들기
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let postsRepository = new PostsRepository(mockPrisma); // prisma대신 -> mockPrisma


describe('Posts Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화
  })

  // 1. getPosts테스트
  test('getPosts Method', async () => {
    const mockReturn = 'mockReturn';
    mockPrisma.posts.findMany.mockReturnValue(mockReturn);
    
    const posts = await postsRepository.getPosts();

    expect(posts).toBe(mockReturn);
    expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);
  });

  // 2. getOnePost테스트
  test('getOnePost Method', async () => {
    const mockReturn = 'mockReturn'; 
    // *의문7: 왜 제대로 비교가 되는 거지 <- postId는 안 넣었는데..? 왜 아래 post랑 비교가 됨? 
      // 그냥, mockprisma의 findUnique를 실행시킨 결과가, repo의 getOnePost와 같은지.
      // 즉, 이.어지나 체크하는 거같음 여기서는.
      // 따라서, 아래에 getOnePost()안에 매개변수 안넣어도 돌아가는 것..이게 무슨 의미있지?
      // 참고로, 아래 update도 repo의 updatePost함수도 인자 3개넣어야하는데, 2개만 넣어도 그대로 돌아감 ㅇ;;;;
      // 아. 이해했다. -> 의문7-2로(update에 있는)
    mockPrisma.posts.findUnique.mockReturnValue(mockReturn);

    const tmpPostId = '1'
    const post = await postsRepository.getOnePost(tmpPostId); // 옳게 함수실행되었다면 post는 위의 mockReturn값이 되어야함

    expect(post).toBe(mockReturn);
    expect(postsRepository.prisma.posts.findUnique).toHaveBeenCalledTimes(1);
    expect(postsRepository.prisma.posts.findUnique).toHaveBeenCalledWith({
      where: { postId: +tmpPostId }
    });
  });

  // 3. createPost테스트
  test('createPost Method', async () => {
    const mockReturn = 'mockReturn';
    mockPrisma.posts.create.mockReturnValue(mockReturn);

    const createPostParams = {
      UserId: 'tmp', 
      Nickname: 'tmp',
      title: 'tmp',
      content: 'tmp',
      likes: 0 // 이거 추가해야! 초기값 무조건 0이라, createPost함수의 변수에 없기에 & 1로 바꾸면 테스트 실패
    };
    const createPostData = await postsRepository.createPost(
      createPostParams.UserId,
      createPostParams.Nickname,
      createPostParams.title,
      createPostParams.content,
    );

    expect(createPostData).toEqual(mockReturn); // repo의 createPost의 return값이 있어야 비교가 됨..
    expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.create).toHaveBeenCalledWith({ data: createPostParams });
  });

  // 4. updatePost테스트
  test('updatePost Method', async () => {
    const mockReturn = 'mockReturn';
    mockPrisma.posts.update.mockReturnValue(mockReturn);

    // *의문7-2: 의문7이 여기서 해결된다 비록 updatePost에 인자를 updatePostParams.postId~content 안넣고,
      // 한개도 안넣어도 실행은 되고 테스트 실패도 안 뜨지만, 아래의 toHaveBeenCalledWith에서 에러가 뜸ㅇㅇ
    const updatePostParams = {
      postId: '1',
      title: 'tmpTitle',
      content: 'tmpContent'
    };
    const updatedPost = await postsRepository.updatePost(
      updatePostParams.postId,
      updatePostParams.title,
      updatePostParams.content,
    );
    
    expect(updatedPost).toEqual(mockReturn);
    expect(mockPrisma.posts.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.update).toHaveBeenCalledWith({
      data: {
        title: updatePostParams.title,
        content: updatePostParams.content,
      },
      where: { postId: +updatePostParams.postId }
    });
  });

  // 5. deletePost테스트
  test('deletePost Method', async () => {
    const mockReturn = 'mockReturn'
    mockPrisma.posts.delete.mockReturnValue(mockReturn);

    const tmpPostId = '1'
    const deletedPost = await postsRepository.deletePost(tmpPostId);

    expect(deletedPost).toEqual(mockReturn);
    expect(mockPrisma.posts.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.delete).toHaveBeenCalledWith({
      where: { postId: +tmpPostId }
    });
  });
});
