import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import LogMiddleware from './middlewares/log.middleware.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import IndexRouter from './routes/index.js';
import UsersRouter from './routes/users.router.js';

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use('/api', [UsersRouter, IndexRouter]);
app.use(ErrorHandlingMiddleware);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
