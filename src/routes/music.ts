import express, { Request, Response } from 'express';
import { createMusicStream } from '@api/music';

const router = express.Router();

export default router.get('/', (req: Request, res: Response) => {
  createMusicStream(req, res);
});
