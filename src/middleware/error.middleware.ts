import { Request, Response, NextFunction } from 'express';
import HTTP404Exception from '../exceptions/HTTP404Exception';
import HTTPClientException from '../exceptions/HTTPClientException';

export function notFoundError() {
  throw new HTTP404Exception('Method not found.');
}

export function clientError(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error instanceof HTTPClientException);
  if (error instanceof HTTPClientException) {
    console.warn(error);
    response
      .status(error.statusCode)
      .send({ message: error.message, statusCode: error.statusCode });
  } else {
    next(error);
  }
}

export function serverError(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    response.status(500).send('Internal Server Error');
  } else {
    response.status(500).send(error.stack);
  }
}
