import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('app-bootstrap');
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule,);
  await app.listen(port);
  logger.log(`server started on ${port} ${process.env.NODE_ENV}`);

}
bootstrap();
