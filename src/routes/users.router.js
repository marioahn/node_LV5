import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { UsersController } from '../controllers/users.controller.js';
import { UsersService } from '../services/users.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const router = express.Router();

class UsersFactory {
  static createUsersComponents(prisma) {
    const usersRepository = new UsersRepository(prisma);
    const usersService = new UsersService(usersRepository);
    const usersController = new UsersController(usersService);
    return { usersController };
  }
};
const { usersController } = UsersFactory.createUsersComponents(prisma);


/** 1. 회원가입API */
router.post('/signup', usersController.sign)
/** 2. 로그인 API */
router.post('/login', usersController.login)




export default router;