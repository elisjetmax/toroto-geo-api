import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('areas')
export class AreaTypeOrmEntity {
  @PrimaryColumn()
  area_id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  geom!: string;
}
