import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {
  normalizeOrigin,
  parseAllowedOrigins,
} from './common/config/cors-origins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = parseAllowedOrigins(
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
  );

  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      console.warn(`[CORS] Origin rechazado: ${origin}`);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  console.info(`[CORS] Orígenes permitidos: ${allowedOrigins.join(', ') || 'ninguno'}`);
  console.info(`Server is running on port ${process.env.PORT}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
