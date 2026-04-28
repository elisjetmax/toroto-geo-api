import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: `Verifica que la API está en línea y operativa.

**Autor:** Elis Arcia  
**Version:** 1.0 — Para efectos de evaluación  
**Contacto:** elis.arcia@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/elisarcia/  
**Código fuente:** https://github.com/elisjetmax/toroto-api.git`,
  })
  @ApiResponse({ status: 200, description: 'API operativa.' })
  getHello(): object {
    return this.appService.getHello();
  }
}
