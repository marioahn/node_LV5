import joi from 'joi';

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

      // 중복 닉네임 찾기 -> 중복이면, repo에서 throw new CustomError
      await this.usersService.findUserById(nickname);
      
      // body데이터에서 바로 확인 가능하므로, 여기서 바로 에러처리(repo로 보낼 필요x)
      if (password.includes(nickname)) { return res.status(412).json({ errorMessage: '패스워드에 닉네임이 포함되어 있습니다' }) };
      if (password !== confirm) { return res.status(412).json({ errorMessage: '패스워드가 일치하지 않습니다' }) };

      await this.usersService.sign(nickname, password, confirm);

      return res.status(201).json({ message: '회원가입에 성공하였습니다' })
    } catch (err) {
      next(err)
    }
  };
  

  /** 2. 로그인 */
  login = async (req,res,next) => {
    try {
      const { nickname, password } = req.body;
      
      // 로그인할 아이디 찾기 -> 에러2개 통과하면 ok
      const token = await this.usersService.login(nickname,password);
      res.cookie('Authorization', `Bearer ${token}`);

      return res.status(200).json({ "token": token });
    } catch (err) {
      next(err)
    }
  };

};