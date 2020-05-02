import { IsEmail, IsDefined } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  email: string;
  @IsDefined()
  password: string;
}
