import express from 'express';
import { getRacesRouter } from './get-races';
import { newRaceRouter } from './new-race';

const router = express.Router({ mergeParams: true });

router.use(newRaceRouter);
router.use(getRacesRouter);

export { router as racesRouter };
