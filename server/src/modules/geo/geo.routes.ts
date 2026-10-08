import { Router } from 'express';
import { asyncHandler } from '../../common/asyncHandler.js';
import { handleSuggest, handleReverse } from './geo.controller.js';

const router = Router();

router.get('/suggest', asyncHandler(handleSuggest));
router.get('/reverse', asyncHandler(handleReverse));

export { router as geoRoutes };
