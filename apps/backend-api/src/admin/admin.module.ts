import { Module } from '@nestjs/common';
import { UserController } from './controllers';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [],
})
export class AdminModule {}
