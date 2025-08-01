import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Demo API')
    .setDescription('Demo NestJS API documentation')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth()
    .build();

  const doccument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, doccument);

  app.enableCors(); 

  app.useStaticAssets(join(__dirname, '../../upload'));

  await app.listen(process.env.PORT);
} 
bootstrap();
