import { Intervention } from '../entities/intervention';

export const INTERVENTION_REPOSITORY = 'INTERVENTION_REPOSITORY';

export interface IInterventionRepository {
  findAll(): Promise<Intervention[]>;
  findById(id: string): Promise<Intervention | null>;
  findByRegion(region: string): Promise<Intervention[]>;
  findByStatus(status: string): Promise<Intervention[]>;
  findNearby(
    lat: number,
    lng: number,
    radiusMeters: number,
  ): Promise<unknown[]>;
  getNearestIntervention(
    lat: number,
    lng: number,
    status?: string,
    subtype?: string,
  ): Promise<unknown>;
  getInterventionsWithinRadius(
    lat: number,
    lng: number,
    radiusKms: number,
    status?: string,
    subtype?: string,
    start_date?: string,
    end_date?: string,
  ): Promise<unknown[]>;
  getInterventionsWithinArea(
    area_id: string,
    status?: string,
    subtype?: string,
  ): Promise<unknown[]>;
  getStatusSummary(): Promise<unknown[]>;
  getSubtypeByRegion(region?: string): Promise<unknown[]>;
  getPrioritySummary(): Promise<unknown[]>;
  getOperatorPerformance(): Promise<unknown[]>;
  getTimeline(): Promise<unknown[]>;
}
