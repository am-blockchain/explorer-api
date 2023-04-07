import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Explorer');
  const PORT = 3000;
  app.setGlobalPrefix('api');
  setupSwagger(app);
  await app.listen(PORT, '0.0.0.0');
  logger.log(`Nest Service is running on: ${await app.getUrl()}`);
}

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Explorer')
    .setDescription('Blockchain Explorer')
    .setVersion('1.0.0')
    .addTag('#tag')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
