import { IsString } from 'class-validator';
export default class createPostDto {
  @IsString()
  public author!: string;
  @IsString()
  public title!: string;
  @IsString()
  public content!: string;
}
