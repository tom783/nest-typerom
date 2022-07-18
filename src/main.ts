import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
