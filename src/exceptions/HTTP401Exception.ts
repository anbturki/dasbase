import HTTPClientException from './HTTPClientException';

export default class HTTP401Exception extends HTTPClientException {
  readonly statusCode = 401;

  constructor(message: string | object = 'Wrong credentials provided') {
    super(message);
  }
}
