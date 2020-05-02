import { RequestHandler } from 'express';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import HTTP400Exception from '../exceptions/HTTP400Exception';

export default function validationMiddleware<T>(
  type: any,
  validatorOptions?: ValidatorOptions,
): RequestHandler {
  // Return an express middleware
  return (request, response, next) => {
    // Validate an imperative object (request.body) against a calss based (DTO).
    validate(plainToClass(type, request.body), validatorOptions).then(
      (errors: ValidationError[]) => {
        // Check if validation did not pass and there are validation errors
        if (errors.length) {
          // map errors into a readable format.
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          // Throw the validation erros to the middleware error handler.
          next(new HTTP400Exception(message));
        } else {
          // Validation pass, containue the request.
          next();
        }
      },
    );
  };
}
