import type { HttpError } from './types';

import 'module-alias/register';
import createError from 'http-errors';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '@routes/index';
import streamRouter from '@routes/stream';
import musicRouter from '@routes/music';
// import uploadRouter from "@routes/upload";
import viewRouter from '@routes/view';
import healthRouter from '@routes/health';

import { sendErrorResponse } from '@src/utils/error';

const app = express();

const CORS_OPT = { origin: [`${ process.env.CORS_ORIGIN }`] };

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', cors(CORS_OPT), indexRouter);
app.use('/stream', cors(CORS_OPT), streamRouter);
app.use('/music', cors(CORS_OPT), musicRouter);
// app.use("/upload", cors(CORS_OPT), uploadRouter);
app.use('/view', cors(CORS_OPT), viewRouter);
app.use('/health', cors(CORS_OPT), healthRouter);
app.use('/ready', cors(CORS_OPT), healthRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: HttpError, req: Request, res: Response) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  return sendErrorResponse(req, res, `${ err.message }`, err.status || 500);
});

export default app;
