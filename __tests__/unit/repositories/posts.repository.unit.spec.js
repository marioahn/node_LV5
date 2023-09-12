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
  test('getPosts Success', async () => {
    const mockReturn = 'mockReturn';
    mockPrisma.posts.findMany.mockReturnValue(mockReturn);
    
    const posts = await postsRepository.getPosts();

    expect(posts).toBe(mockReturn);
    expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);
  });

  // 2. getOnePost테스트
  test('getOnePost Success', async () => {
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

    // 2-1. update에러1: 게시글 존재x경우
    test('getOnePost Error1 - 게시글x', async () => {
      const samplePost = null
      mockPrisma.posts.findUnique.mockReturnValue(samplePost);
  
      try {
        await postsRepository.getOnePost('555') // 있을리 없는 변수 넣어서 실행
      } catch (err) {
        expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
        expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
          where: { postId: +'555' }
        });
        expect(err.message).toEqual('게시글이 존재하지 않습니다');
      }
    });

  // 3. createPost테스트
  test('createPost Success', async () => {
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
  test('updatePost Success', async () => {
    const samplePost = {
      'UserId': 333,
      'postId': '111',
      'Nickname': '002',
      'title': 'aa',
      'content': 'aa',
      "createdAt": new Date("2023-09-15T07:47:15.980Z"),
      "updatedAt": new Date("2023-09-09T07:49:17.585Z")
    }
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);
    mockPrisma.posts.update.mockReturnValue(samplePost);

    const updatedData = ['bb','bb']

    const updatedPost = await postsRepository.updatePost(
      samplePost.UserId,
      samplePost.postId,
      updatedData[0], // samplePost.title대신 바뀔 내용
      updatedData[1]
    );
    
    // expect(updatedPost).toEqual(samplePost); // true나옴 why?
      // updatedPost가 진짜로 바뀌면 그건 진짜 db변경이니 그대로인거임?
      // 즉, updatedPost와 samplePost가 같다가 나오는게 진짜 의도o인거임? 이상한데...
      // 애초에, 위에서 MockPrisma.posts.udpate한 결과는 그대로 sample이니..
    expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
      where: { postId: +samplePost.postId }
    });
    expect(mockPrisma.posts.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.update).toHaveBeenCalledWith({
      data: {
        title: updatedData[0],
        content: updatedData[1],
      },
      where: { postId: +samplePost.postId }
    });
  });

  // 4-2. update에러1: 게시글 존재x경우
  test('updatePost Error1 - 게시글x', async () => {
    const samplePost = null
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);

    try {
      await postsRepository.updatePost(5555,'555','any','any') // 있을리 없는 변수 넣어서 실행
    } catch (err) {
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
        where: { postId: +'555' }
      });
      expect(mockPrisma.posts.update).toHaveBeenCalledTimes(0); // 에러때문에 updatex -> 0
      expect(err.message).toEqual('게시글이 존재하지 않습니다');
    };
  });

  // 4-3. update에러2: 게시글 수정권한x
  test('updatePost Error2 - 수정권한x', async () => {
    const samplePost = {
      'UserId': 333,
      'postId': '111',
      'Nickname': '002',
      'title': 'aa',
      'content': 'aa',
      "createdAt": new Date("2023-09-15T07:47:15.980Z"),
      "updatedAt": new Date("2023-09-09T07:49:17.585Z")
    }
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);
    mockPrisma.posts.update.mockReturnValue(samplePost);

    try {
      await postsRepository.updatePost(334,'111','any','any2') // UserId를 이상하게 넣기
    } catch (err) {
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
        where: { postId: +'111' }
      });
      expect(mockPrisma.posts.update).toHaveBeenCalledTimes(0); // 에러때문에 updatex -> 0
      expect(err.message).toEqual('게시글 수정 권한이 없습니다');
    };
  });

  // 5. deletePost테스트
  test('deletePost Success', async () => {
    const samplePost = {
      'postId': 111,
      'UserId': 333,
      'Nickname': '002',
      'title': 'aa',
      'content': 'aa',
      "createdAt": new Date("2023-09-15T07:47:15.980Z"),
      "updatedAt": new Date("2023-09-09T07:49:17.585Z")
    }
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);
    // 아래의 delete함수는 실제 실행은 아님 -> 따라서, 아래 calledTimes는 2가 아니라 1 그대로.
    mockPrisma.posts.delete.mockReturnValue(samplePost); 
    
    const deletedPost = await postsRepository.deletePost(333,111); // sample의 UserId,postId

    expect(deletedPost).toEqual(samplePost);
    expect(mockPrisma.posts.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.posts.delete).toHaveBeenCalledWith({
      where: { postId: 111 }
    });
  });

  // 5-2. delete에러1: 게시글 존재x경우
  test('deletePost Error1 - 게시글x', async () => {
    const samplePost = null
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);

    try {
      await postsRepository.deletePost(5555,'555','any','any') // 있을리 없는 변수 넣어서 실행
    } catch (err) {
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
        where: { postId: +'555' }
      });
      expect(mockPrisma.posts.delete).toHaveBeenCalledTimes(0); // 에러때문에 updatex -> 0
      expect(err.message).toEqual('게시글이 존재하지 않습니다');
    };
  });

  // 4-3. delete에러2: 게시글 삭제권한x
  test('deletePost Error2 - 삭제권한x', async () => {
    const samplePost = {
      'UserId': 333,
      'postId': '111',
      'Nickname': '002',
      'title': 'aa',
      'content': 'aa',
      "createdAt": new Date("2023-09-15T07:47:15.980Z"),
      "updatedAt": new Date("2023-09-09T07:49:17.585Z")
    }
    mockPrisma.posts.findUnique.mockReturnValue(samplePost);
    mockPrisma.posts.delete.mockReturnValue(samplePost);

    try {
      await postsRepository.deletePost(334,'111','any','any2') // UserId를 이상하게 넣기
    } catch (err) {
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.posts.findUnique).toHaveBeenCalledWith({
        where: { postId: +'111' }
      });
      expect(mockPrisma.posts.delete).toHaveBeenCalledTimes(0); // 에러때문에 updatex -> 0
      expect(err.message).toEqual('게시글 삭제 권한이 없습니다');
    };
  });


});
