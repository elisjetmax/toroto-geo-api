import { Intervention } from '../../domain/entities/intervention';
import { InterventionTypeOrmEntity } from './intervention.typeorm-entity';
import { InterventionStatus } from '../../../shared/domain/constants/intervention-status';
import { InterventionSubtype } from '../../../shared/domain/constants/intervention-subtype';
import { Region } from '../../../shared/domain/constants/region';

export class InterventionMapper {
  static toDomain(entity: InterventionTypeOrmEntity): Intervention {
    const domain = new Intervention();
    domain.id = entity.id;
    domain.subtype = entity.subtype as InterventionSubtype;
    domain.status = entity.status as InterventionStatus;
    domain.project_id = entity.project_id;
    domain.region = entity.region as Region;
    domain.geom = entity.geom;
    domain.date = entity.date;
    domain.intervention_timestamp = entity.intervention_timestamp;
    domain.operator_id = entity.operator_id;
    domain.priority = entity.priority;
    domain.quality_score = entity.quality_score;
    domain.extra_metadata = entity.extra_metadata;
    domain.metrics = entity.metrics;
    return domain;
  }
}
