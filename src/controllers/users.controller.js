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
      const isExistName = await this.usersService.findUserById(nickname);
      if (isExistName) { return res.status(412).json({ errorMessage: '중복된 닉네임입니다' }) };

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
      
      const isExistUser = await this.usersService.findUserById(nickname);
      if (!isExistUser) { // 해당하는 유저가 존재하지 않을 경우
        return res.status(412).json({ errorMessage: '닉네임을 확인해주세요' })
      } else if (isExistUser.password !== password) {
        return res.status(412).json({ errorMessage: '패스워드를 확인해주세요' })
      };

      // *의문2 -> jwt.sign도 계층을 나눠서 각각 작성해야하나?
        // token도 db저장소에 담..겨야 하니까 이것도 service,repo에..? jwt.sign은 repo에서 하고?
      const token = jwt.sign({ userId: isExistUser.userId }, 'hj_secretkey');
      res.cookie('Authorization', `Bearer ${token}`);

      return res.status(200).json({ "token": token });
    } catch (err) {
      next(err)
    }
  };

};