import HTTP400Exception from './HTTP400Exception';

export default class UserWithThatEmailAlreadyExistsException extends HTTP400Exception {
  constructor(email: string) {
    console.log('ggg');
    super(`User with that ${email} email already exists`);
  }
}
