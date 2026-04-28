import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.setGlobalPrefix('toroto-api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TOROTO GEO API')
    .setDescription(
      `API REST de monitoreo de intervenciones ambientales geoespaciales con capa de inteligencia artificial.

**Desarrollado por:** Elis Arcia  
**LinkedIn:** [linkedin.com/in/elisarcia](https://www.linkedin.com/in/elisarcia/)  
**Contacto:** elis.arcia@gmail.com  
**Version:** 1.0 — Para efectos de evaluación`,
    )
    .setVersion('1.0')
    .setContact(
      'Elis Arcia',
      'https://www.linkedin.com/in/elisarcia/',
      'elis.arcia@gmail.com',
    )
    .setLicense('Para efectos de evaluación', '')
    .addTag('App', 'Información general de la API')
    .addTag('Interventions', 'Consultas sobre intervenciones ambientales')
    .addTag('AI', 'Motor de interpretación semántica TOROTO-AI')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('toroto-api/docs', app, document, {
    customCssUrl:
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
    console.log(`Swagger docs on /toroto-api/docs`);
  });
}
bootstrap().catch(console.error);
