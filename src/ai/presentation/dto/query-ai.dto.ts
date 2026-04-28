import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class QueryAiDto {
  @IsNotEmpty({ message: 'La pregunta no puede estar vacía' })
  @IsString({ message: 'La pregunta debe ser un texto' })
  @MinLength(5, { message: 'La pregunta debe tener al menos 5 caracteres' })
  question!: string;

  @IsOptional()
  @IsString()
  session_id?: string;
}
