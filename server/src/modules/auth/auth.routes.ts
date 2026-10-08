import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetMe,
  handleRefresh,
  handleForgotPassword,
  handleResetPassword,
  handleUpdateProfile,
} from './auth.controller.js';
import { authenticate } from './auth.middleware.js';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.get('/me', authenticate, handleGetMe);
router.post('/refresh', handleRefresh);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);
router.patch('/profile', authenticate, handleUpdateProfile);

export { router as authRoutes };
