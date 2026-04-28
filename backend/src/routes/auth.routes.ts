import { Router } from 'express';
import { login, me, signup } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { handleValidation } from '../middleware/validate.middleware';
import { loginValidation, signupValidation } from '../validators/auth.validator';

const authRouter = Router();

authRouter.post('/signup', signupValidation, handleValidation, signup);
authRouter.post('/login', loginValidation, handleValidation, login);
authRouter.get('/me', requireAuth, me);

export { authRouter };
