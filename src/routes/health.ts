import express, { Request, Response } from 'express';

import serverEvents from '@src/modules/serverEventEmitter';

const router = express.Router();
let serverReady = false;

serverEvents.on('ready', (state) => {
  serverReady = state;
});

// Liveness probe route
router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

// Readiness probe route
router.get('/', (req: Request, res: Response) => {
  if (serverReady) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

export default router;
