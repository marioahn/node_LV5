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

  // 회원가입 시, 중복닉네임 확인용
  findUserById = async (nickname) => {
    const user = await this.usersRepository.findUserById(nickname);
    
    return user
  };

  login = async (nickname,password) => {
    const token = await this.usersRepository.login(nickname,password);

    return token
  }


};