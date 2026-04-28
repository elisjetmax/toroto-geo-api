import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum InterventionRegion {
  NORTH = 'north',
  CENTRAL = 'central',
  WEST = 'west',
  EAST = 'east',
  SOUTH = 'south',
  CLUSTER_TEST_AREA = 'cluster_test_area',
}

export class FindByRegionDto {
  @ApiProperty({
    enum: InterventionRegion,
    example: InterventionRegion.NORTH,
    description: `Región de la intervención. Opciones: ${Object.values(InterventionRegion).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'region es requerido.' })
  @IsEnum(InterventionRegion, {
    message: `Region inválida. Opciones: ${Object.values(InterventionRegion).join(', ')}.`,
  })
  region!: InterventionRegion;
}
