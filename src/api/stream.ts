import type { Request, Response } from 'express';
import fs from 'fs';

import { sendErrorResponse } from '@src/utils/error';

export const createStream = (req: Request, res: Response): void => {
  const range = req.headers.range;

  if (!range) {
    return sendErrorResponse(req, res, 'Requires range header', 400);
  }

  const { video } = req.query;

  if (video && typeof video === 'string') {
    try {
      const videoType = video.split('.').pop();
      const videoPath = `./assets/videos/${ video }`;
      const videoSize = fs.statSync(videoPath).size;

      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range?.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const contentLength = end - start + 1;

      const headers = {
        'Content-Range':  `bytes ${ start }-${ end }/${ videoSize }`,
        'Accept-Ranges':  'bytes',
        'Content-Length': contentLength,
        'Content-Type':   `video/${ videoType }`,
      };

      // http status 206 for partial content
      res.writeHead(206, headers);

      // create video read stream for this particular chunk
      const videoStream = fs.createReadStream(videoPath, {
        start,
        end,
      });

      videoStream.on('error', (error) => {
        console.log(error);
        res.sendStatus(500);
      });

      // stream the video chunk to the client
      videoStream.pipe(res);
    } catch(e) {
      console.error(e);
      sendErrorResponse(req, res, 'Internal server error.', 500);
    }
  } else {
    return sendErrorResponse(req, res, 'Video query not provided.', 400);
  }
};
