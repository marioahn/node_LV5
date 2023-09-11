export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository
  }

  // 회원가입
  sign = async (nickname, password, confirm) => {
    const createdUser = await this.usersRepository.sign(
      nickname, password, confirm
    );

    return {
      nickname: createdUser.nickname,
      password: createdUser.password,
      confirm: createdUser.confirm
    };
  };

  // 회원가입 시, 중복닉네임 확인용으로 만들어야 했던 함수..
  findUserById = async (nickname) => {
    const user = await this.usersRepository.findUserById(nickname);
    
    return user
  };

  // login = 


};