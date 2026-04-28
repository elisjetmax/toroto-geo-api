import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('interventions')
export class InterventionTypeOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  subtype!: string;

  @Column()
  status!: string;

  @Column()
  project_id!: string;

  @Column()
  region!: string;

  @Column({ type: 'text', nullable: true })
  geom!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'timestamptz' })
  intervention_timestamp!: Date;

  @Column()
  operator_id!: string;

  @Column()
  priority!: string;

  @Column({ type: 'float' })
  quality_score!: number;

  @Column({ type: 'jsonb', nullable: true })
  extra_metadata!: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metrics!: Record<string, any>;
}
