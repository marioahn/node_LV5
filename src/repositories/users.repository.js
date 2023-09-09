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

    return user;
  }

  // login = 

};