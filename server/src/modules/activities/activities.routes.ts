import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { authenticate } from '../auth/auth.middleware.js';
import {
  handleListActivities,
  handleGetActivity,
  handleCreateActivity,
  handleGetActivityRegistrations,
  handleGetActivityTeams,
  handleCreateActivityTeam,
  handleJoinActivityTeam,
  handleUpdateRegistrationStatus,
} from './activities.controller.js';
import { handleRegisterActivity } from '../registrations/registrations.controller.js';

const router = Router();

// ADR 007: Mandatory login to browse activities
router.get('/', authenticate, asyncHandler(handleListActivities));
router.get('/:id', authenticate, asyncHandler(handleGetActivity));
router.post('/', authenticate, asyncHandler(handleCreateActivity));
router.post('/:id/registrations', authenticate, asyncHandler(handleRegisterActivity));
router.get('/:id/registrations', authenticate, asyncHandler(handleGetActivityRegistrations));
router.patch('/registrations/:regId', authenticate, asyncHandler(handleUpdateRegistrationStatus));

// Team Formation endpoints for team events
router.get('/:id/teams', authenticate, asyncHandler(handleGetActivityTeams));
router.post('/:id/teams', authenticate, asyncHandler(handleCreateActivityTeam));
router.post('/:id/teams/:teamId/join', authenticate, asyncHandler(handleJoinActivityTeam));

export { router as activitiesRoutes };
