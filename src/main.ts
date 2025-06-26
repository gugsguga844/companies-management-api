import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importe o ValidationPipe
import { HttpExceptionFilter } from './common/filters/http-exception.filter'; // 1. Importe o filtro

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // <-- ADICIONE ESTA LINHA
  app.useGlobalFilters(new HttpExceptionFilter()); // <-- ADICIONE ESTA LINHA

  await app.listen(3002);
}
bootstrap();