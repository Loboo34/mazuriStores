import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  refreshToken
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, schemas } from '../middlewares/validate.middleware';

const router = Router();

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', validate(schemas.updateProfile), updateProfile);
router.put('/change-password', validate(schemas.changePassword), changePassword);

export default router;