import type { Request, Response } from 'express';

import fs from 'fs';

import { sendErrorResponse } from '@src/utils/error';

export const createMusicStream = (req: Request, res: Response) => {
  const { range } = req.headers;
  const songPath = `./assets/music/${ req.query.song }`;

  if (!fs.existsSync(songPath)) {
    return sendErrorResponse(req, res, 'Song file does not exist.', 404);
  }

  if (!range) {
    return sendErrorResponse(req, res, 'Requires Range header', 400);
  }

  try {
    const songSize = fs.statSync(songPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB

    const start = Number(range?.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, songSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      'Content-Range':  `bytes ${ start }-${ end }/${ songSize }`,
      'Accept-Ranges':  'bytes',
      'Content-Length': contentLength,
      'Content-Type':   'audio/ogg',
    };

    // http status 206 for partial content
    res.writeHead(206, headers);

    // create music read stream for this particular chunk
    const musicStream = fs.createReadStream(songPath, {
      start,
      end,
    });

    musicStream.on('error', (error) => {
      console.warn('[error] Music stream:', error);
      res.sendStatus(500);
    });

    // stream the music chunk to the client
    musicStream.pipe(res);
  } catch(e) {
    console.error(e);
    sendErrorResponse(req, res, 'Internal server error.', 500);
  }
};
