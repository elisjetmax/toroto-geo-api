import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum InterventionStatus {
  VALIDATED = 'validated',
  IN_PROGRESS = 'in_progress',
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

export class FindByStatusDto {
  @ApiProperty({
    description: 'Estado de la intervención.',
    example: InterventionStatus.VALIDATED,
    enum: InterventionStatus,
  })
  @IsNotEmpty({ message: 'status es requerido.' })
  @IsEnum(InterventionStatus, {
    message: `Status inválido. Opciones: ${Object.values(InterventionStatus).join(', ')}.`,
  })
  status!: InterventionStatus;
}
