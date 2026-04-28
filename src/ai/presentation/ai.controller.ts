import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AiService } from '../application/ai.service';
import { QueryAiDto } from './dto/query-ai.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Consulta en lenguaje natural',
    description:
      'Interpreta preguntas en español o inglés y las transforma en consultas estructuradas sobre intervenciones ambientales.',
  })
  @ApiBody({
    type: QueryAiDto,
    examples: {
      nearest_neighbor_es: {
        summary: 'Mas cercana a un punto (ES)',
        value: {
          question: '¿Cuál es la intervención más cercana a 20.701, -103.321?',
        },
      },
      nearest_neighbor_en: {
        summary: 'Closest reforestacion (EN)',
        value: {
          question: 'What is the closest reforestacion to 20.700, -103.320?',
        },
      },
      within_radius_es: {
        summary: 'Radio con filtros (ES)',
        value: {
          question:
            'Intervenciones validadas en 5km desde 20.700, -103.320 en marzo 2026',
        },
      },
      within_radius_en: {
        summary: 'Within radius (EN)',
        value: {
          question:
            'Show completed interventions within 10km of 20.65, -103.40',
        },
      },
      within_area_zone_a: {
        summary: 'Dentro de zone_a',
        value: { question: 'Show gavion interventions inside zone_a' },
      },
      within_area_zone_b: {
        summary: 'Dentro de zone_b',
        value: { question: 'List completed interventions inside zone_b' },
      },
      within_area_zone_c: {
        summary: 'Dentro de zone_c (cluster)',
        value: { question: 'List completed interventions inside zone_c' },
      },
      within_area_cluster: {
        summary: 'Cluster area (ES)',
        value: { question: '¿Cuántas intervenciones hay en el cluster?' },
      },
      subtype_by_region_es: {
        summary: 'Subtipos por region (ES)',
        value: { question: '¿Cuántas intervenciones hay en la región north?' },
      },
      subtype_by_region_en: {
        summary: 'Subtype breakdown (EN)',
        value: { question: 'Show intervention breakdown by region' },
      },
      status_summary_es: {
        summary: 'Resumen por estado (ES)',
        value: { question: 'Dame el resumen por estado' },
      },
      status_summary_en: {
        summary: 'Status summary (EN)',
        value: { question: 'Give me a summary by status' },
      },
      priority_summary_es: {
        summary: 'Por prioridad (ES)',
        value: { question: '¿Cuántas intervenciones hay por prioridad?' },
      },
      priority_summary_en: {
        summary: 'Priority breakdown (EN)',
        value: { question: 'How many interventions per priority level?' },
      },
      operator_performance_es: {
        summary: 'Rendimiento de operadores (ES)',
        value: { question: '¿Cómo están trabajando los operadores?' },
      },
      operator_performance_en: {
        summary: 'Operator performance (EN)',
        value: { question: 'How are operators performing?' },
      },
      timeline_es: {
        summary: 'Tendencia temporal (ES)',
        value: { question: 'Muéstrame la evolución de intervenciones por mes' },
      },
      timeline_en: {
        summary: 'Timeline (EN)',
        value: { question: 'Show intervention trends over time' },
      },
      out_of_scope_es: {
        summary: 'Fuera de alcance (ES)',
        value: { question: '¿Cuánto es 2 + 2?' },
      },
      out_of_scope_en: {
        summary: 'Out of scope (EN)',
        value: { question: 'What is the weather today?' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Consulta procesada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Pregunta fuera del alcance del sistema.',
  })
  async queryAI(@Body() dto: QueryAiDto): Promise<Record<string, unknown>> {
    return this.aiService.queryAi(dto.question, dto.session_id) as Promise<
      Record<string, unknown>
    >;
  }
}
