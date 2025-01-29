import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUser } from './users/entity/user.entity';

@Module({
  imports: [UsersModule, DatabaseModule, TypeOrmModule.forFeature([EUser]) ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
