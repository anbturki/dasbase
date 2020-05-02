import HTTP400Exception from './HTTP400Exception';

export default class UserWithThatEmailAlreadyExistsException extends HTTP400Exception {
  constructor(email: string) {
    super(`User with that ${email} email already exists`);
  }
}
