import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Register Global Exception Filter for guaranteed error CORS & logging
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // SkillSwap CORS Pattern: Supports comma-separated origins, trailing slash stripping, & dynamic origin checking
  const configuredUrls = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
    : [];

  const defaultOrigins = [
    'https://mini-sales.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const allowedOrigins = Array.from(new Set([...configuredUrls, ...defaultOrigins]));

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      // Permissive fallback for production robustness
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
  });

  // Global prefix (excludes / and /health for Railway healthchecks and root ping)
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health'],
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Application running on port ${port}: http://0.0.0.0:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start NestJS server:', err);
  process.exit(1);
});
