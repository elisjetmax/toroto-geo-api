import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IInterventionRepository } from '../domain/repositories/intervention.repository';
import { INTERVENTION_REPOSITORY } from '../domain/repositories/intervention.repository';
import { Intervention } from '../domain/entities/intervention';

@Injectable()
export class InterventionsService {
  constructor(
    @Inject(INTERVENTION_REPOSITORY)
    private readonly interventionRepository: IInterventionRepository,
  ) {}

  findAll(): Promise<Intervention[]> {
    return this.interventionRepository.findAll();
  }

  async findById(id: string): Promise<Intervention> {
    const intervention = await this.interventionRepository.findById(id);
    if (!intervention)
      throw new NotFoundException(
        `La intervención con id ${id} no fue encontrada`,
      );
    return intervention;
  }

  findByRegion(region: string): Promise<Intervention[]> {
    return this.interventionRepository.findByRegion(region);
  }

  findByStatus(status: string): Promise<Intervention[]> {
    return this.interventionRepository.findByStatus(status);
  }

  findNearby(
    lat: number,
    lng: number,
    radiusMeters: number,
  ): Promise<unknown[]> {
    return this.interventionRepository.findNearby(lat, lng, radiusMeters);
  }

  getNearestIntervention(
    lat: number,
    lng: number,
    status?: string,
    subtype?: string,
  ): Promise<unknown> {
    return this.interventionRepository.getNearestIntervention(
      lat,
      lng,
      status,
      subtype,
    );
  }

  getInterventionsWithinRadius(
    lat: number,
    lng: number,
    radiusKms: number,
    status?: string,
    subtype?: string,
    start_date?: string,
    end_date?: string,
  ): Promise<unknown[]> {
    return this.interventionRepository.getInterventionsWithinRadius(
      lat,
      lng,
      radiusKms,
      status,
      subtype,
      start_date,
      end_date,
    );
  }

  getInterventionsWithinArea(
    area_id: string,
    status?: string,
    subtype?: string,
  ): Promise<unknown[]> {
    return this.interventionRepository.getInterventionsWithinArea(
      area_id,
      status,
      subtype,
    );
  }

  getStatusSummary(): Promise<unknown[]> {
    return this.interventionRepository.getStatusSummary();
  }

  getSubtypeByRegion(region?: string): Promise<unknown[]> {
    return this.interventionRepository.getSubtypeByRegion(region);
  }

  getPrioritySummary(): Promise<unknown[]> {
    return this.interventionRepository.getPrioritySummary();
  }

  getOperatorPerformance(): Promise<unknown[]> {
    return this.interventionRepository.getOperatorPerformance();
  }

  getTimeline(): Promise<unknown[]> {
    return this.interventionRepository.getTimeline();
  }
}
