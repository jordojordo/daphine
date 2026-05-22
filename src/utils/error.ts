import { Response } from 'express';

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    error: true,
    statusCode,
    message
  });
};
