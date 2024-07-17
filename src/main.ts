import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /** Para produccion y desarrollo */
  app.enableCors({
    origin: [
      'http://154.38.181.5',
      'http://localhost:4002',
      'http://restaurantify.pe',
    ],
    credentials: true, // si necesitas enviar cookies u otros datos de autenticación
  });

  // app.enableCors();

  await app.startAllMicroservices();
  await app.listen(5000);
}

bootstrap();
