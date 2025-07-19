import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 Habilita validações automáticas com class-validator nos DTOs
  app.useGlobalPipes(new ValidationPipe());

  // 🌐 Habilita CORS para permitir chamadas do frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  Logger.log(`🚀 Backend rodando em http://localhost:${PORT}`);
}
bootstrap();
