import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import Joi from 'joi';

@Global()
@Module({
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        ORIGIN: Joi.string(),
        TWITCH_CLIENT_ID: Joi.string(),
        TWITCH_CLIENT_SECRET: Joi.string(),
        TWITCH_CALLBACK_URL: Joi.string(),
        SESSION_SECRET: Joi.string(),
        DATABASE_URL: Joi.string(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class ConfigModule {}
