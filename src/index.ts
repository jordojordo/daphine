import type { HttpError } from './types';

import 'module-alias/register';
import createError from 'http-errors';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import streamRouter from '@routes/stream';
import musicRouter from '@routes/music';
import healthRouter from '@routes/health';

import { sendErrorResponse } from '@src/utils/error';

const app = express();

const CORS_OPT = { origin: [`${ process.env.CORS_ORIGIN }`] };

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/stream', cors(CORS_OPT), streamRouter);
app.use('/music', cors(CORS_OPT), musicRouter);
app.use('/health', cors(CORS_OPT), healthRouter);
app.use('/ready', cors(CORS_OPT), healthRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: HttpError, req: Request, res: Response) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  return sendErrorResponse(res, `${ err.message }`, err.status || 500);
});

export default app;
