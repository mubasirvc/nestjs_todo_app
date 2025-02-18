import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoServices } from './todo.service';
import { ETodo } from './entity/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ETodo]), UsersModule],
  controllers: [TodoController],
  providers: [TodoServices],
})
export class TodoModule {}
