import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      name: 'TOROTO GEO API',
      version: '1.0',
      description:
        'API REST de monitoreo de intervenciones ambientales geoespaciales con capa de inteligencia artificial.',
      author: 'Elis Arcia',
      contact: 'elis.arcia@gmail.com',
      linkedin: 'https://www.linkedin.com/in/elisarcia/',
      note: 'Para efectos de evaluación',
      docs: '/toroto-api/docs',
      github: 'https://github.com/elisjetmax/toroto-api.git',
    };
  }
}
