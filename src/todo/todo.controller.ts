import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoServices } from './todo.service';
import { CreateTodoDto } from './dto/create.todo.dto';
import { UsersService } from 'src/users/user.service';
import { ITodo } from './interface/todo.interface';
import { UpdateTodoDto } from './dto/update.todo';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(AuthGuard)
@Controller('api/')
export class TodoController {
  constructor(
    private readonly todoService: TodoServices,
    private readonly userService: UsersService,
  ) {}

  @Post(':users/:userId/todos')
  async create(
    @Body() body: CreateTodoDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException(`User not found`);

    const newTodo = await this.todoService.create(body, user);

    return newTodo;
  }

  @Get('users/:userId/todos')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ITodo[]> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    const todos = await this.todoService.findAll(userId);

    return todos;
  }

  @Get('users/:userId/todos/:todoId')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    const todo = await this.todoService.findOne(todoId);
    if (!todo) throw new NotFoundException('todo not found');

    return todo;
  }

  @Put('users/:userId/todos/:todoId')
  async update(
    @Body() todoData: UpdateTodoDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    const updatedTodo = await this.todoService.update({
      ...todoData,
      id: todoId,
    });

    if (!updatedTodo) throw new NotFoundException('Todo not found');

    return updatedTodo;
  }

  @Delete('users/:userId/todos/:todoId')
  async delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<Boolean> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('user not found');

    const todo = await this.todoService.findOne(todoId);
    if (!todo) throw new NotFoundException('todo not found');

    const isDeleted = await this.todoService.delete(todoId);

    return isDeleted;
  }
}
