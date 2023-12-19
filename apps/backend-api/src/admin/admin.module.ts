import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { ConfigService } from '@app/backend-api/admin/services';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [ConfigService],
})
export class AdminModule {}
