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
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Todos')
@UseGuards(AuthGuard)
@Controller('api/users/:userId/todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoServices,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create a new Todo for a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post()
  async create(
    @Body() body: CreateTodoDto,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException(`User not found`);

    return await this.todoService.create(body, user);
  }

  @ApiOperation({ summary: 'Get all Todos for a user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of todos' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get()
  async findAll(@Param('userId', ParseIntPipe) userId: number): Promise<ITodo[]> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    return await this.todoService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a specific Todo by ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiParam({ name: 'todoId', type: Number, description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'User or Todo not found' })
  @Get(':todoId')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const todo = await this.todoService.findOne(todoId);
    if (!todo) throw new NotFoundException('Todo not found');

    return todo;
  }

  @ApiOperation({ summary: 'Update a Todo by ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiParam({ name: 'todoId', type: Number, description: 'Todo ID' })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'User or Todo not found' })
  @Put(':todoId')
  async update(
    @Body() todoData: UpdateTodoDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<ITodo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const updatedTodo = await this.todoService.update({ ...todoData, id: todoId });
    if (!updatedTodo) throw new NotFoundException('Todo not found');

    return updatedTodo;
  }

  @ApiOperation({ summary: 'Delete a Todo by ID' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiParam({ name: 'todoId', type: Number, description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'User or Todo not found' })
  @Delete(':todoId')
  async delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const todo = await this.todoService.findOne(todoId);
    if (!todo) throw new NotFoundException('Todo not found');

    return await this.todoService.delete(todoId);
  }
}
