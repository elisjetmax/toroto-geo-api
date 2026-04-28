import { BadRequestException } from '@nestjs/common';
import {
  INTERVENTION_STATUSES,
  InterventionStatus,
} from '../../shared/domain/constants/intervention-status';
import {
  INTERVENTION_SUBTYPES,
  InterventionSubtype,
} from '../../shared/domain/constants/intervention-subtype';
import { AREA_IDS, AreaId } from '../../shared/domain/constants/area';

export interface Intent {
  query_type: string;
  params: Record<string, unknown>;
}

const VALID_QUERY_TYPES = [
  'nearest_neighbor',
  'within_radius',
  'within_area',
  'status_summary',
  'subtype_by_region',
  'priority_summary',
  'operator_performance',
  'timeline',
  'out_of_scope',
] as const;

function toNumber(value: unknown, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num))
    throw new BadRequestException(
      `El campo ${fieldName} debe ser un número válido.`,
    );
  return num;
}

export function validateIntent(intent: Intent): void {
  const { query_type, params } = intent;

  if (
    !VALID_QUERY_TYPES.includes(
      query_type as (typeof VALID_QUERY_TYPES)[number],
    )
  ) {
    throw new BadRequestException(
      `Tipo de consulta desconocido: ${query_type}. Debe ser uno de: ${VALID_QUERY_TYPES.join(', ')}`,
    );
  }

  if (query_type === 'out_of_scope') {
    throw new BadRequestException(
      'La consulta no se puede responder porque está fuera del alcance de los datos disponibles.',
    );
  }

  if (query_type === 'nearest_neighbor' || query_type === 'within_radius') {
    if (params.lat == null || params.lon == null) {
      throw new BadRequestException(
        'Se requieren coordenadas (lat, lon) para esta consulta.',
      );
    }
    params.lat = toNumber(params.lat, 'lat');
    params.lon = toNumber(params.lon, 'lon');
  }

  if (query_type === 'within_radius') {
    if (params.radius_km == null)
      throw new BadRequestException(
        'Se requiere un radio en kilómetros (radius_km).',
      );
    params.radius_km = toNumber(params.radius_km, 'radius_km');
    if ((params.radius_km as number) <= 0)
      throw new BadRequestException(
        'El radio en kilómetros (radius_km) debe ser un número positivo.',
      );
  }

  if (query_type === 'within_area') {
    if (!params.area_id || !AREA_IDS.includes(params.area_id as AreaId)) {
      throw new BadRequestException(
        `Área desconocida: ${String(params.area_id)}. Debe ser una de: ${AREA_IDS.join(', ')}`,
      );
    }
  }

  if (
    params.status &&
    !INTERVENTION_STATUSES.includes(params.status as InterventionStatus)
  ) {
    throw new BadRequestException(
      `Estado desconocido: ${params.status as string}. Debe ser uno de: ${INTERVENTION_STATUSES.join(', ')}`,
    );
  }

  if (
    params.subtype &&
    !INTERVENTION_SUBTYPES.includes(params.subtype as InterventionSubtype)
  ) {
    throw new BadRequestException(
      `Subtipo desconocido: ${params.subtype as string}. Debe ser uno de: ${INTERVENTION_SUBTYPES.join(', ')}`,
    );
  }
}
