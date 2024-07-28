import { IsInt, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePokemonDto {

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsInt()
  @IsPositive()
  no: number;
}
