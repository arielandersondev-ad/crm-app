import { IsString } from "class-validator";

export class PublicChatQueryDto {
  @IsString()
  question: string;

  @IsString()
  tenantSlug: string;
}
