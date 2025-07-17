import { ConfigService } from '@/config/config.service';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '@repo/database';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import passport from 'passport';
import { TwitchHttpExceptionFilter } from './admin/filters/twitch-http-exception.filter';
import { AppModule } from './app/app.module';
import { ZodFilter } from './filters/zod.filter';

import './instruments';

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days.
const SESSION_CHECK_PERIOD = 2 * 60 * 1000; // 2 minutes.

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('/api');

  app.set('query parser', 'extended');

  app.useGlobalFilters(new ZodFilter());
  app.useGlobalFilters(new TwitchHttpExceptionFilter());

  await app.listen(port);
}

void bootstrap();
