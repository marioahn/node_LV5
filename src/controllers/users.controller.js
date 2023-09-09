import joi from 'joi';
import jwt from 'jsonwebtoken';

const createdSchema = joi.object({
  nickname: joi.string().alphanum().min(3).required(),
  password: joi.string().min(4).required(),
  confirm: joi.string().min(4).required()
})


export class UsersController {
  constructor(usersService) {
    this.usersService = usersService
  };

  /** 1. 회원가입 */
  sign = async (req,res,next) => {
    try {
      const validation = await createdSchema.validateAsync(req.body);
      const { nickname, password, confirm } = validation;

      // findUserById의 return값은 user지만 이름은 그냥 isExistName으로
      // *의문1
      const isExistName = await this.usersService.findUserById(nickname);
      if (isExistName) { return res.status(412).json({ errorMessage: '중복된 닉네임입니다' }) };

      if (password.includes(nickname)) { return res.status(412).json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다' }) };
      if (password !== confirm) { return res.status(412).json({ errorMessage: '패스워드가 일치하지 않습니다' }) };

      await this.usersService.sign(nickname, password, confirm); // 변수에 안담아도 되지?

      return res.status(201).json({ message: '회원가입에 성공하였습니다' })
    } catch (err) {
      next(err)
    }
  };
  

  /** 2. 로그인 */
  login = async (req,res,next) => {
    try {
      const { nickname, password } = req.body;
      
      // 해당하는 유저가 존재하지 않을 경우
        // 아 근데, 애초에 findUserById는 nickname만 맞는지 체크(repo에서 where로)하는 함수
        // 로그인의 로직은 무엇인가?
          // 닉네임과 패스워드 둘다 맞아야 함. 즉, 이미 존재하는 유저정보의 것과 맞아야 로그인 가능
          // 그럼, 아래처럼 쓰면 안되지 일단. null.'key'는 에러잖아
          // 아~ 함수 새로 만들어야 하나? 그렇다고 where: nick,pass로 하면 또 위의 nick만 검증하는거 로직 어긋나
          // 아래처럼 하면 될듯 -> 굳이 새로 안 만들고. else if로 묶은이유와 애초에 isExistUser.nickname || ~.password
          // 로 못한 이유는 null.key는 에러기 때문
      const isExistUser = await this.usersService.findUserById(nickname);
      if (!isExistUser) {
        return res.status(412).json({ errorMessage: '닉네임을 확인해주세요' })
      } else if (isExistUser.password !== password) {
        return res.status(412).json({ errorMessage: '패스워드를 확인해주세요' })
      };

      // *의문2 -> 이것도 나눌 필요가 있나..?
        // token도 db저장소에 담..겨야 하니까 이것도 service,repo에..? jwt.sign은 repo에서 하고?
      const token = jwt.sign({ userId: isExistUser.userId }, 'hj_secretkey');
      res.cookie('Authorization', `Bearer ${token}`);

      return res.status(200).json({ "token": token });
    } catch (err) {
      next(err)
    }
  };

};