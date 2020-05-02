import { IsString, IsEmail, MinLength } from 'class-validator';

export default class SignupDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
}
