import type { Request, Response } from 'express';

import fs from 'fs';

import { sendErrorResponse } from '@src/utils/error';
import { resolveAsset } from '@src/utils/paths';
import { parseRange } from '@src/utils/range';

export const createStream = (req: Request, res: Response): void => {
  const { range } = req.headers;
  const { video } = req.query;

  if (!range) {
    return sendErrorResponse(res, 'Requires range header', 400);
  }

  if (typeof video !== 'string') {
    return sendErrorResponse(res, 'Video query not provided.', 400);
  }

  const videoPath = resolveAsset('videos', video);

  if (!videoPath) {
    return sendErrorResponse(res, 'Video file does not exist.', 404);
  }

  try {
    const videoType = video.split('.').pop();
    const videoSize = fs.statSync(videoPath).size;
    const byteRange = parseRange(range, videoSize);

    if (!byteRange) {
      res.setHeader('Content-Range', `bytes */${ videoSize }`);

      return sendErrorResponse(res, 'Range not satisfiable', 416);
    }

    const { start, end } = byteRange;
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
      res.destroy();
    });

    // stream the video chunk to the client
    videoStream.pipe(res);
  } catch(e) {
    console.error(e);
    sendErrorResponse(res, 'Internal server error.', 500);
  }
};
