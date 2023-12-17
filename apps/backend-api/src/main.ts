import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';

// 30 days.
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const sessionSecret = app.get(ConfigService).get('SESSION_SECRET');

  app.enableCors();
  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: COOKIE_MAX_AGE,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);

  Logger.log(`🚀 Backend is running on: http://localhost:${port}`);
}

void bootstrap();
