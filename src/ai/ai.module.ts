import { Module } from '@nestjs/common';
import { AiService } from './application/ai.service';
import { AiController } from './presentation/ai.controller';
import { GroqQueryEngine } from './infrastructure/groq/groq-query-engine';
import { InterventionsModule } from '../interventions/interventions.module';

@Module({
  imports: [InterventionsModule],
  providers: [AiService, GroqQueryEngine],
  controllers: [AiController],
})
export class AiModule {}
