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


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
