import HTTPClientException from './HTTPClientException';

export default class NotAuthorizedException extends HTTPClientException {
  readonly statusCode = 403;

  constructor(message: string | object = "You're not authorized") {
    super(message);
  }
}
