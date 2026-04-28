import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindByIdDto {
  @ApiProperty({
    example: 'int_001',
    description: 'ID de la intervención.',
  })
  @IsNotEmpty({ message: 'id es requerido.' })
  @IsString()
  id!: string;
}
