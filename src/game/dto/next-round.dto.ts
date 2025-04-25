import { IsString } from 'class-validator';

export class NextRoundDto {
  @IsString()
  roomId: string;
}
