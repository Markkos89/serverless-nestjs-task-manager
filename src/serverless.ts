import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import * as cookieParser from 'cookie-parser';
// import serverlessExpress from '@vendia/serverless-express';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
