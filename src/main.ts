import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // solo acepta lo que el backend espera y lo demas lo borra
      forbidNonWhitelisted: true, // manda un error[] en lo que no se espera
      transform: true, // transforma los valores de los DTO al valor que espera
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )

  await app.listen(3000);
};


bootstrap();
