import { Controller, Get, Param, Query } from '@nestjs/common';
import { InterventionsService } from '../application/interventions.service';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { FindByRegionDto } from './dto/find-by-region.dto';
import { FindByStatusDto } from './dto/find-by-status.dto';
import { FindByIdDto } from './dto/find-by-id.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Interventions')
@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las intervenciones',
    description:
      'Retorna el listado completo de intervenciones ambientales geoespaciales.',
  })
  @ApiResponse({ status: 200, description: 'Lista de intervenciones.' })
  findAll() {
    return this.interventionsService.findAll();
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Intervenciones cercanas a un punto',
    description:
      'Retorna intervenciones dentro de un radio en metros desde las coordenadas indicadas, ordenadas por distancia.',
  })
  @ApiQuery({
    name: 'lat',
    type: Number,
    example: 20.7,
    description: 'Latitud del punto de referencia.',
  })
  @ApiQuery({
    name: 'lng',
    type: Number,
    example: -103.32,
    description: 'Longitud del punto de referencia.',
  })
  @ApiQuery({
    name: 'radius',
    type: Number,
    example: 5000,
    description: 'Radio de búsqueda en metros.',
  })
  @ApiResponse({
    status: 200,
    description: 'Intervenciones encontradas dentro del radio.',
  })
  findNearby(@Query() dto: FindNearbyDto) {
    return this.interventionsService.findNearby(dto.lat, dto.lng, dto.radius);
  }

  @Get('region/:region')
  @ApiOperation({
    summary: 'Intervenciones por región',
    description:
      'Retorna todas las intervenciones pertenecientes a una región geográfica específica.',
  })
  @ApiParam({
    name: 'region',
    enum: ['north', 'central', 'west', 'east', 'south', 'cluster_test_area'],
    example: 'north',
    description: 'Región geográfica.',
  })
  @ApiResponse({
    status: 200,
    description: 'Intervenciones de la región indicada.',
  })
  findByRegion(@Param() dto: FindByRegionDto) {
    return this.interventionsService.findByRegion(dto.region);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Intervenciones por estado',
    description:
      'Retorna todas las intervenciones que se encuentran en un estado operativo específico.',
  })
  @ApiParam({
    name: 'status',
    enum: ['planned', 'in_progress', 'completed', 'validated'],
    example: 'completed',
    description: 'Estado de la intervención.',
  })
  @ApiResponse({
    status: 200,
    description: 'Intervenciones con el estado indicado.',
  })
  findByStatus(@Param() dto: FindByStatusDto) {
    return this.interventionsService.findByStatus(dto.status);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar intervención por ID',
    description:
      'Retorna el detalle completo de una intervención específica por su identificador único.',
  })
  @ApiParam({
    name: 'id',
    example: 'int_001',
    description: 'Identificador único de la intervención.',
  })
  @ApiResponse({ status: 200, description: 'Intervención encontrada.' })
  @ApiResponse({ status: 404, description: 'Intervención no encontrada.' })
  findById(@Param() dto: FindByIdDto) {
    return this.interventionsService.findById(dto.id);
  }
}
