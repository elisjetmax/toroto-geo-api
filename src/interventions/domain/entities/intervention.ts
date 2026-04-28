import { InterventionStatus } from '../../../shared/domain/constants/intervention-status';
import { InterventionSubtype } from '../../../shared/domain/constants/intervention-subtype';
import { Region } from '../../../shared/domain/constants/region';

export class Intervention {
  id!: string;
  subtype!: InterventionSubtype;
  status!: InterventionStatus;
  project_id!: string;
  region!: Region;
  geom?: string;
  date!: string;
  intervention_timestamp!: Date;
  operator_id!: string;
  priority!: string;
  quality_score!: number;
  extra_metadata?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
}
