import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { authenticate } from '../auth/auth.middleware.js';
import {
  handleGetMyRegistrations,
  handleCancelRegistration,
} from './registrations.controller.js';

const router = Router();

router.get('/me', authenticate, asyncHandler(handleGetMyRegistrations));
router.post('/:id/cancel', authenticate, asyncHandler(handleCancelRegistration));

export { router as registrationsRoutes };
