import { IsNotEmpty } from 'class-validator';

export class createBoardDto {
  @IsNotEmpty()
  title: String;

  @IsNotEmpty()
  description: String;
}
