import { IsString } from 'class-validator';

export class AnnounceWinnerDto {
  @IsString()
  roomId: string;

  @IsString()
  winnerName: string;
}
