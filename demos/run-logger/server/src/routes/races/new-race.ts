import { body } from 'express-validator';

import express, { Request, Response } from 'express';
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from '@sjoedwards/common';
import { Race } from '../../models/race';

const router = express.Router();

router.post(
  '/api/races',
  [
    body('raceName').trim().isLength({ min: 2 }),
    body('length').isNumeric(),
    body('time').isNumeric(),
  ],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { raceName } = req.body;

    const existingRace = await Race.findOne({
      raceName,
      userId: req.currentUser.id,
    });

    if (existingRace) {
      throw new BadRequestError('Race already exists for current user ');
    }

    const race = Race.build({
      userId: req.currentUser.id,
      ...req.body,
    });

    await race.save();
    res.status(201).send(race);
  }
);

export { router as newRaceRouter };
