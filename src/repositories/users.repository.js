import { CustomError } from "../errors/customError.js";
import jwt from 'jsonwebtoken';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma
  };

  sign = async (nickname, password, confirm) => {
    const createdUser = await this.prisma.users.create({
      data: { nickname, password, confirm, aboutLike: '' }
    });

    return createdUser;
  };

  findUserById = async (nickname) => {
    const user = await this.prisma.users.findUnique({
      where: { nickname }
    });
    if (user) { // 중복닉이면, 회원가입x
      throw new CustomError(412,'중복된 닉네임입니다')
    };

    return user;
  }

  login = async (nickname,password) => {
    const user = await this.prisma.users.findUnique({
      where: { nickname }
    });

    // 에러처리
    if (!user) { // (1)해당하는 유저가 존재하지 않을 경우
      throw new CustomError(412,'닉네임을 확인해주세요')
    } else if (user.password !== password) { // (2)닉은 존재하지만, 비번이 틀린 경우
      throw new CustomError(412,'패스워드를 확인해주세요')
    };

    // 에러x면 token생성 및 return
    const token = jwt.sign({ userId: user.userId }, 'hj_secretkey');
    return token
  }

};