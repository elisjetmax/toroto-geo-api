import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindNearbyDto {
  @ApiProperty({
    description: 'Latitud del punto de referencia.',
    example: 40.7128,
  })
  @IsNotEmpty({ message: 'lat es requerido.' })
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber({}, { message: 'Latitud debe ser un número.' })
  @Min(-90, { message: 'Latitud debe ser mayor a -90.' })
  @Max(90, { message: 'Latitud debe ser menor a 90.' })
  lat!: number;

  @ApiProperty({
    description: 'Longitud del punto de referencia.',
    example: -74.006,
  })
  @IsNotEmpty({ message: 'lng es requerido.' })
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber({}, { message: 'Longitud debe ser un número.' })
  @Min(-180, { message: 'Longitud debe ser mayor a -180.' })
  @Max(180, { message: 'Longitud debe ser menor a 180.' })
  lng!: number;

  @ApiProperty({
    description: 'Radio de búsqueda en metros.',
    example: 500,
  })
  @IsNotEmpty({ message: 'radius es requerido.' })
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber({}, { message: 'Radio debe ser un número.' })
  @IsPositive({ message: 'Radio debe ser un número positivo.' })
  radius!: number;
}
