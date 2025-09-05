import express, { Request, Response } from 'express';
import { createView } from '@api/view';

const router = express.Router();

export default router.get('/', (req: Request, res: Response) => {
  createView(req, res);
});
