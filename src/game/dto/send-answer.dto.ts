import { IsString } from 'class-validator';

export class SendAnswerDto {
  @IsString()
  roomId: string;

  @IsString()
  answer: string;
}
