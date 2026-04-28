import { Injectable } from '@nestjs/common';
import { InterventionsService } from '../../interventions/application/interventions.service';
import { GroqQueryEngine } from '../infrastructure/groq/groq-query-engine';
import { validateIntent } from '../domain/intent';

@Injectable()
export class AiService {
  constructor(
    private readonly groqQueryEngine: GroqQueryEngine,
    private readonly interventionsService: InterventionsService,
  ) {}

  async queryAi(userQuestion: string, sessionId?: string): Promise<object> {
    try {
      const intent = await this.groqQueryEngine.extractIntent(
        userQuestion,
        sessionId,
      );
      validateIntent(intent);

      const { query_type, params } = intent;
      let result: unknown;

      switch (query_type) {
        case 'nearest_neighbor':
          result = await this.interventionsService.getNearestIntervention(
            params['lat'] as number,
            params['lon'] as number,
            params['status'] as string | undefined,
            params['subtype'] as string | undefined,
          );
          break;
        case 'within_radius':
          result = await this.interventionsService.getInterventionsWithinRadius(
            params['lat'] as number,
            params['lon'] as number,
            params['radius_km'] as number,
            params['status'] as string | undefined,
            params['subtype'] as string | undefined,
            params['start_date'] as string | undefined,
            params['end_date'] as string | undefined,
          );
          break;
        case 'within_area':
          result = await this.interventionsService.getInterventionsWithinArea(
            params['area_id'] as string,
            params['status'] as string | undefined,
            params['subtype'] as string | undefined,
          );
          break;
        case 'status_summary':
          result = await this.interventionsService.getStatusSummary();
          break;
        case 'subtype_by_region':
          result = await this.interventionsService.getSubtypeByRegion(
            params['region'] as string | undefined,
          );
          break;
        case 'priority_summary':
          result = await this.interventionsService.getPrioritySummary();
          break;
        case 'operator_performance':
          result = await this.interventionsService.getOperatorPerformance();
          break;
        case 'timeline':
          result = await this.interventionsService.getTimeline();
          break;
      }

      const answer = await this.groqQueryEngine.generateNaturalLanguageResponse(
        userQuestion,
        query_type,
        result,
        sessionId,
      );
      return { query_type, intent, data: result, answer };
    } catch (error: unknown) {
      const isRateLimit =
        (error as { status?: number })?.status === 413 ||
        (error as { error?: { error?: { code?: string } } })?.error?.error
          ?.code === 'rate_limit_exceeded';

      if (isRateLimit) {
        return {
          answer:
            'Se excedió el límite de tokens permitido por el modelo. Intenta con una pregunta más específica o reduce el contexto.',
        };
      }
      throw error;
    }
  }
}
