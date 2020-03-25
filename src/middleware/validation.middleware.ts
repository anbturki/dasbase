import { RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import HttpException from '../exceptions/HttpException';

export default function validationMiddleware<T>(type: any): RequestHandler {
  return function (request, response, next) {
    validate(plainToClass(type, request.body)).then(
      (errors: ValidationError[]) => {
        if (errors.length) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}
