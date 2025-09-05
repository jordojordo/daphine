import { Request, Response } from 'express';

export const sendErrorResponse = (
  req: Request,
  res: Response,
  message: string,
  statusCode: number = 500,
  acceptType: string = 'application/json'
) => {
  const imageUrl = `https://httpstatusdogs.com/img/${ statusCode }.jpg`;
  const requestAccept = req.headers.accept || acceptType;

  if (requestAccept.includes('html')) {
    res.status(statusCode).render('error', {
      status:   statusCode,
      message:  message || 'An unexpected error occurred',
      imageUrl
    });
  } else {
    res.status(statusCode).json({
      error: true,
      statusCode,
      message
    });
  }
};
