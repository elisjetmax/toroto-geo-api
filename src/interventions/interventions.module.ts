import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterventionsService } from './application/interventions.service';
import { InterventionsController } from './presentation/interventions.controller';
import { InterventionTypeOrmRepository } from './infrastructure/persistence/intervention.typeorm-repository';
import { InterventionTypeOrmEntity } from './infrastructure/persistence/intervention.typeorm-entity';
import { AreaTypeOrmEntity } from './infrastructure/persistence/area.typeorm-entity';
import { INTERVENTION_REPOSITORY } from './domain/repositories/intervention.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterventionTypeOrmEntity, AreaTypeOrmEntity]),
  ],
  providers: [
    InterventionsService,
    {
      provide: INTERVENTION_REPOSITORY,
      useClass: InterventionTypeOrmRepository,
    },
  ],
  controllers: [InterventionsController],
  exports: [InterventionsService],
})
export class InterventionsModule {}
