import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { authenticate } from '../auth/auth.middleware.js';
import {
  handleListActivities,
  handleGetActivity,
  handleCreateActivity,
} from './activities.controller.js';
import { handleRegisterActivity } from '../registrations/registrations.controller.js';

const router = Router();

// ADR 007: Mandatory login to browse activities
router.get('/', authenticate, asyncHandler(handleListActivities));
router.get('/:id', authenticate, asyncHandler(handleGetActivity));
router.post('/', authenticate, asyncHandler(handleCreateActivity));
router.post('/:id/registrations', authenticate, asyncHandler(handleRegisterActivity));

export { router as activitiesRoutes };
