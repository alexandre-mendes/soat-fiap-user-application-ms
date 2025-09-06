import { Router } from 'express';
import { userController } from '../config/di-config';
import { errorHandler } from './errorHandler';

const userRouter = Router();

userRouter.get('/api/users/:id', errorHandler(userController.findById.bind(userController)));
userRouter.post('/api/users', errorHandler(userController.create.bind(userController)));
userRouter.delete('/api/users/:id', errorHandler(userController.delete.bind(userController)));
userRouter.post('/api/auth/login', errorHandler(userController.authenticate.bind(userController)));

export default userRouter;