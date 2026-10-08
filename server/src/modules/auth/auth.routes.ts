import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
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

router.post('/register', asyncHandler(handleRegister));
router.post('/login', asyncHandler(handleLogin));
router.post('/logout', asyncHandler(handleLogout));
router.get('/me', authenticate, asyncHandler(handleGetMe));
router.post('/refresh', asyncHandler(handleRefresh));
router.post('/forgot-password', asyncHandler(handleForgotPassword));
router.post('/reset-password', asyncHandler(handleResetPassword));
router.patch('/profile', authenticate, asyncHandler(handleUpdateProfile));

export { router as authRoutes };
