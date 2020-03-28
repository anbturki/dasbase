import { IsString } from 'class-validator';
export default class createUserDto {
  @IsString()
  public name!: string;
  @IsString()
  public email!: string;
  @IsString()
  public password!: string;
}
