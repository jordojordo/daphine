import express, { Request, Response } from 'express';
import { createTransaction } from '@api/request';

const router = express.Router();

export default router.post('/', (req: Request, res: Response) => {
  createTransaction(req, res);
});
