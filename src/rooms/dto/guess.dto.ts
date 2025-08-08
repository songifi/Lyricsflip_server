import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class GuessDto {
  @IsUUID()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  guess: string;
}
