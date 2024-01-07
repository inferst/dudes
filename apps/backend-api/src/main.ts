import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import session from 'express-session';
import passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@app/backend-api/config/config.service';
import { ZodFilter } from './filters/zod.filter';

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days.
const SESSION_CHECK_PERIOD = 2 * 60 * 1000; // 2 minutes.

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const configService = app.get(ConfigService);

  // TODO: configure cors.
  app.enableCors();
  app.use(
    session({
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: SESSION_CHECK_PERIOD,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
      secret: configService.sessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: COOKIE_MAX_AGE,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('/api');

  app.useGlobalFilters(new ZodFilter());

  await app.listen(port);

  Logger.log(`🚀 Backend is running on: http://localhost:${port}`);
}

void bootstrap();
