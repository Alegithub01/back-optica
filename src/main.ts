import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 HABILITAR CORS PARA TU FRONTEND
  app.enableCors({
    origin: ['http://localhost:3000','http://76.13.171.103:3000',
              'https://optica-nuevo-estilo.com',
              'https://www.optica-nuevo-estilo.com'],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log('Backend corriendo en http://localhost:4000');
}
bootstrap();
