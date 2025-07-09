import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  matchId: string;
}