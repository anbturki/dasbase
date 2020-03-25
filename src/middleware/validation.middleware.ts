import { RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import HTTP400Exception from '../exceptions/HTTP400Exception';

export default function validationMiddleware<T>(
  type: any,
  skipMissingProperties: boolean = false
): RequestHandler {
  return function (request, response, next) {
    validate(plainToClass(type, request.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(new HTTP400Exception(message));
        } else {
          next();
        }
      }
    );
  };
}
