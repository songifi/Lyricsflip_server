import { IsString, IsNotEmpty } from 'class-validator';

export class GuessLyricDto {
  @IsString()
  @IsNotEmpty()
  guess: string;
}
