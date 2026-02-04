/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { JwtTenantGuard } from './auth/guards/jwt-tenant.guard'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api') // every controller is under /api/...

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
    .setTitle('Glass CRM API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer'
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-company-id', in: 'header' },
      'x-company-id'
    )
    .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    document.security = [{ bearer: [], 'x-company-id': [] }]
    SwaggerModule.setup('api/docs', app, document)
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  app.enableCors({
    origin: [ 'http://localhost:4200'],
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'x-company-id',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
  const reflector = app.get(Reflector)
  const jwt = app.get(JwtService)
  app.useGlobalGuards(new JwtTenantGuard(jwt, reflector))
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
