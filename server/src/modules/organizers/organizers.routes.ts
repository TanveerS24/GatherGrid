import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { authenticate } from '../auth/auth.middleware.js';
import { handleGetOrganizerProfile } from '../activities/activities.controller.js';

const router = Router();

router.get('/:id', authenticate, asyncHandler(handleGetOrganizerProfile));

export { router as organizersRoutes };
