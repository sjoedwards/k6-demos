import { currentUser, requireAuth } from '@sjoedwards/common';
import express, { Request, Response } from 'express';
import { Race } from '../../models/race';

const router = express.Router();

router.get(
  '/api/races/me',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    // Populate is going to take the ObjectId for ticket and then populate the order
    const orders = await Race.find({ userId: req.currentUser.id });

    res.send(orders);
  }
);

export { router as getRacesRouter };
