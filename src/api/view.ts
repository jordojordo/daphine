import type { Request, Response } from 'express';

import fs from 'fs';

import { sendErrorResponse } from '@src/utils/error';

export const createView = (req: Request, res: Response) => {
  const filesPath = './assets/files';

  fs.readdir(filesPath, (err, files) => {
    if (err) {
      return sendErrorResponse(req, res, `Unable to read directory: ${ err }`, 500);
    }

    files.forEach((file) => {
      const fileStream = fs.createReadStream(`${ filesPath }/${ file }`);

      fileStream.on('error', (error) => {
        sendErrorResponse(req, res, `Error with file stream: ${ error }`, 500);
      });

      fileStream.pipe(res);
    });

    res.end();
  });
};
