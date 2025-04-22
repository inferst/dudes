import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Global()
@Module({
  exports: [PrismaService],
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class DatabaseModule {}
