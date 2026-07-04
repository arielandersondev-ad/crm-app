import { IsString } from "class-validator";

export class ChatQueryDto {
  @IsString()
  question: string;
}
