import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common'; // Importe o ValidationPipe
import { HttpExceptionFilter } from './common/filters/http-exception.filter'; // 1. Importe o filtro
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new TransformInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', 
  });

  const config = new DocumentBuilder()
  .setTitle('ContabSys API')
  .setDescription('ContabSys API description')
  .setVersion('1.0')
  .addTag('auth', 'Operações de Autenticação (Login & Cadastro)')
  .addTag('companies', 'Gerenciamento de Empresas (CRUD)')
  .addBearerAuth()
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();