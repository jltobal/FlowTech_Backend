import { IsString } from "class-validator";

export class MatchDto {
  @IsString()
  usuarioDestinoId: string;

  @IsString()
  action: "Like" | "Superlike" | "Dislike";
}