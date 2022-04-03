import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  // swagger / open api
  const config = new DocumentBuilder()
    .setTitle('Task Manager Serverless API')
    .setDescription(
      'Documentation with the endpoints we have available for the frontend',
    )
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // cors
  app.enableCors();

  // tells nest to execute a validation pipe whenever he encounters a validation decorator
  app.useGlobalPipes(new ValidationPipe());

  // tells nest to use the transformation interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  const PORT = process.env.PORT;

  await app.listen(PORT);

  logger.log(`Application listening on port ${PORT}`);
  logger.log(`Swagger available on: http://localhost:8080/docs/`);
}

bootstrap();
