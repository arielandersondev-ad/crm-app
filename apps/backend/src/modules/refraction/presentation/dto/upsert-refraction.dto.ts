import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpsertRefractionDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  odLejosEsf?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  odLejosCil?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(180)
  odLejosEje?: number;

  @IsOptional()
  @IsString()
  odLejosAv?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  oiLejosEsf?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  oiLejosCil?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(180)
  oiLejosEje?: number;

  @IsOptional()
  @IsString()
  oiLejosAv?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  lejosDip?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  odCercaEsf?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  odCercaCil?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(180)
  odCercaEje?: number;

  @IsOptional()
  @IsString()
  odCercaAv?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  oiCercaEsf?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  oiCercaCil?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(180)
  oiCercaEje?: number;

  @IsOptional()
  @IsString()
  oiCercaAv?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  cercaDip?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  add?: number;
}
