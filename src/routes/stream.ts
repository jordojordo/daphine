import express, { Request, Response } from 'express';
import { createStream } from '@api/stream';

const router = express.Router();

export default router.get('/', (req: Request, res: Response) => {
  createStream(req, res);
});
