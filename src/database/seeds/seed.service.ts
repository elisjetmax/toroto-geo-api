import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface SeedIntervention {
  id: string;
  subtype: string;
  status: string;
  project_id: string;
  region: string;
  coordinates: { lat: number; lon: number };
  date: string;
  timestamp: string;
  operator_id: string;
  priority: string;
  quality_score: number;
  metadata: Record<string, unknown>;
  metrics: Record<string, unknown>;
}

interface SeedArea {
  area_id: string;
  name: string;
  geometry: Record<string, unknown>;
}

interface SeedDataset {
  interventions: SeedIntervention[];
  areas: SeedArea[];
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedInterventions();
    await this.seedAreas();
    await this.ensureSpatialIndexes();
  }

  private async seedInterventions(): Promise<void> {
    const count = await this.dataSource.getRepository('interventions').count();
    if (count > 0) {
      console.log('Las intervenciones ya han sido cargadas.');
      return;
    }
    console.log('Cargando data de intervenciones...');

    const filePath = path.join(
      __dirname,
      'geospatial_interventions_dataset.json',
    );
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dataset = JSON.parse(rawData) as SeedDataset;

    for (const item of dataset.interventions) {
      await this.dataSource.query(
        `INSERT INTO interventions 
                      (id, subtype, status, project_id, region, geom, date, intervention_timestamp, operator_id, priority, quality_score, extra_metadata, metrics)
                     VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9, $10, $11, $12, $13, $14)`,
        [
          item.id,
          item.subtype,
          item.status,
          item.project_id,
          item.region,
          item.coordinates.lon,
          item.coordinates.lat,
          item.date,
          item.timestamp,
          item.operator_id,
          item.priority,
          item.quality_score,
          JSON.stringify(item.metadata),
          JSON.stringify(item.metrics),
        ],
      );
    }
    console.log(
      `Se cargaron ${dataset.interventions.length} intervenciones en la base de datos.`,
    );
  }

  private async seedAreas(): Promise<void> {
    const count = await this.dataSource.getRepository('areas').count();
    if (count > 0) {
      console.log('Las áreas ya han sido cargadas.');
      return;
    }
    console.log('Cargando data de áreas...');

    const filePath = path.join(
      __dirname,
      'geospatial_interventions_dataset.json',
    );
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dataset = JSON.parse(rawData) as SeedDataset;

    for (const area of dataset.areas) {
      await this.dataSource.query(
        `INSERT INTO areas (area_id, name, geom)
                 VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))`,
        [area.area_id, area.name, JSON.stringify(area.geometry)],
      );
    }
    console.log(
      `Se cargaron ${dataset.areas.length} áreas en la base de datos.`,
    );
  }

  private async ensureSpatialIndexes(): Promise<void> {
    // La columna geom se almacena como WKB hex (text en TypeORM, geometry en PG).
    // El cast explícito permite crear el índice GIST sobre el tipo geometry real.
    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_interventions_geom
      ON interventions USING GIST ((geom::geometry))
    `);
    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_areas_geom
      ON areas USING GIST ((geom::geometry))
    `);
    console.log('Índices espaciales GIST verificados.');
  }
}
