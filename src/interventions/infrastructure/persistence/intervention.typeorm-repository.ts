import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IInterventionRepository } from '../../domain/repositories/intervention.repository';
import { Intervention } from '../../domain/entities/intervention';
import { InterventionTypeOrmEntity } from './intervention.typeorm-entity';
import { InterventionMapper } from './intervention.mapper';

@Injectable()
export class InterventionTypeOrmRepository implements IInterventionRepository {
  constructor(
    @InjectRepository(InterventionTypeOrmEntity)
    private readonly repo: Repository<InterventionTypeOrmEntity>,
  ) {}

  private readonly BASE_SELECT = `
    SELECT id, subtype, status, project_id, region, date,
           intervention_timestamp, operator_id, priority, quality_score,
           extra_metadata, metrics,
           ST_AsGeoJSON(geom) as geom
    FROM interventions
  `;

  async findAll(): Promise<Intervention[]> {
    const rows = (await this.repo.query(
      this.BASE_SELECT,
    )) as unknown as InterventionTypeOrmEntity[];
    return rows.map((e) => InterventionMapper.toDomain(e));
  }

  async findById(id: string): Promise<Intervention | null> {
    const rows = (await this.repo.query(`${this.BASE_SELECT} WHERE id = $1`, [
      id,
    ])) as unknown as InterventionTypeOrmEntity[];
    return rows[0] ? InterventionMapper.toDomain(rows[0]) : null;
  }

  async findByRegion(region: string): Promise<Intervention[]> {
    const rows = (await this.repo.query(
      `${this.BASE_SELECT} WHERE region = $1`,
      [region],
    )) as unknown as InterventionTypeOrmEntity[];
    return rows.map((e) => InterventionMapper.toDomain(e));
  }

  async findByStatus(status: string): Promise<Intervention[]> {
    const rows = (await this.repo.query(
      `${this.BASE_SELECT} WHERE status = $1`,
      [status],
    )) as unknown as InterventionTypeOrmEntity[];
    return rows.map((e) => InterventionMapper.toDomain(e));
  }

  findNearby(lat: number, lng: number, radiusMeters: number): Promise<any[]> {
    return this.repo.query(
      `SELECT
        id, subtype, status, project_id, region, date,
        intervention_timestamp, operator_id, priority, quality_score,
        extra_metadata, metrics,
        ST_AsGeoJSON(geom) as geom,
        ROUND(ST_Distance(geom::geography, ST_MakePoint($1, $2)::geography)::numeric, 2) AS distance_m
       FROM interventions
       WHERE ST_DWithin(geom::geography, ST_MakePoint($1, $2)::geography, $3)
       ORDER BY distance_m ASC`,
      [lng, lat, radiusMeters],
    );
  }

  async getNearestIntervention(
    lat: number,
    lng: number,
    status?: string,
    subtype?: string,
  ): Promise<unknown> {
    let query = `
      SELECT
        id, subtype, status, project_id, region, date,
        operator_id, priority, quality_score, metrics,
        ST_AsGeoJSON(geom) as geom,
        ROUND(ST_Distance(geom::geography, ST_MakePoint($1, $2)::geography)::numeric, 2) AS distance_m
      FROM interventions
      WHERE 1=1
    `;
    const params: (string | number)[] = [lng, lat];
    let paramIndex = 3;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (subtype) {
      query += ` AND subtype = $${paramIndex++}`;
      params.push(subtype);
    }

    query += ` ORDER BY distance_m ASC LIMIT 1`;
    const rows = (await this.repo.query(query, params)) as unknown as unknown[];
    return rows[0] ?? null;
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
    let query = `
      SELECT
        id, subtype, status, project_id, region, date,
        operator_id, priority, quality_score, metrics,
        ST_AsGeoJSON(geom) as geom,
        ROUND(ST_Distance(geom::geography, ST_MakePoint($1, $2)::geography)::numeric, 2) AS distance_m
      FROM interventions
      WHERE ST_DWithin(geom::geography, ST_MakePoint($1, $2)::geography, $3)
    `;
    const params: (string | number)[] = [lng, lat, radiusKms * 1000];
    let paramIndex = 4;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (subtype) {
      query += ` AND subtype = $${paramIndex++}`;
      params.push(subtype);
    }
    if (start_date) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(end_date);
    }

    query += ` ORDER BY distance_m ASC`;
    return this.repo.query(query, params);
  }

  getInterventionsWithinArea(
    area_id: string,
    status?: string,
    subtype?: string,
  ): Promise<unknown[]> {
    let query = `
      SELECT
        id, subtype, status, project_id, region, date,
        operator_id, priority, quality_score, metrics,
        ST_AsGeoJSON(geom) as geom
      FROM interventions
      WHERE ST_Within(geom, (SELECT geom FROM areas WHERE area_id = $1))
    `;
    const params: (string | number)[] = [area_id];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (subtype) {
      query += ` AND subtype = $${paramIndex++}`;
      params.push(subtype);
    }

    return this.repo.query(query, params);
  }

  getStatusSummary(): Promise<any[]> {
    return this.repo.query(`
      SELECT status, COUNT(*) as count
      FROM interventions
      GROUP BY status ORDER BY count DESC
    `);
  }

  getSubtypeByRegion(region?: string): Promise<unknown[]> {
    const where = region ? 'WHERE region = $1 ' : '';
    const params = region ? [region] : [];
    return this.repo.query(
      `SELECT region, subtype, COUNT(*) as count FROM interventions ${where}GROUP BY region, subtype ORDER BY region, count DESC`,
      params,
    );
  }

  getPrioritySummary(): Promise<any[]> {
    return this.repo.query(`
      SELECT priority, COUNT(*) as count
      FROM interventions
      GROUP BY priority ORDER BY count DESC
    `);
  }

  getOperatorPerformance(): Promise<any[]> {
    return this.repo.query(`
      SELECT
        operator_id,
        COUNT(*) as total_interventions,
        ROUND(AVG(quality_score)::numeric, 2) as avg_quality_score,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'validated') as validated
      FROM interventions
      GROUP BY operator_id
      ORDER BY avg_quality_score DESC
    `);
  }

  getTimeline(): Promise<any[]> {
    return this.repo.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'validated') as validated
      FROM interventions
      WHERE date IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);
  }
}
