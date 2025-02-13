import { Module } from '@nestjs/common';
import { UsersService } from './users/user.service';
import { UsersModule } from './users/user.module';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [UsersModule, DatabaseModule, TodoModule],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
