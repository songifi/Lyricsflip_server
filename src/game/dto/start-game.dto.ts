import { IsString } from 'class-validator';

export class StartGameDto {
  @IsString()
  roomId: string;
}
