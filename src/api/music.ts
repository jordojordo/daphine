import type { Request, Response } from 'express';

import fs from 'fs';

import { sendErrorResponse } from '@src/utils/error';
import { resolveAsset } from '@src/utils/paths';
import { parseRange } from '@src/utils/range';

export const createMusicStream = (req: Request, res: Response) => {
  const { range } = req.headers;
  const { song } = req.query;

  if (typeof song !== 'string') {
    return sendErrorResponse(res, 'Song query not provided', 400);
  }

  const songPath = resolveAsset('music', song);

  if (!songPath) {
    return sendErrorResponse(res, 'Song file does not exist.', 404);
  }

  if (!range) {
    return sendErrorResponse(res, 'Requires Range header', 400);
  }

  try {
    const songSize = fs.statSync(songPath).size;
    const byteRange = parseRange(range, songSize);

    if (!byteRange) {
      res.setHeader('Content-Range', `bytes */${ songSize }`);

      return sendErrorResponse(res, 'Range not satisfiable', 416);
    }

    const { start, end } = byteRange;
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
      res.destroy();
    });

    // stream the music chunk to the client
    musicStream.pipe(res);
  } catch(e) {
    console.error(e);
    sendErrorResponse(res, 'Internal server error.', 500);
  }
};
