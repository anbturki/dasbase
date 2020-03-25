import HTTPClientException from './HTTPClientException';

export default class HTTP400Exception extends HTTPClientException {
  readonly statusCode = 400;

  constructor(message: string | object = 'Bad Request') {
    super(message);
  }
}
