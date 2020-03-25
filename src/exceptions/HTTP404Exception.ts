import HTTPClientException from './HTTPClientException';

export default class HTTP404Exception extends HTTPClientException {
  readonly statusCode = 404;

  constructor(message: string | object = 'Not found') {
    super(message);
  }
}
