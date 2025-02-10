import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/user.service';
import { UsersModule } from './users/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
