import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/creat.user.dto';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users/')
export class UsersController {
  constructor(private userServices: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<IUser> {
    const userAlreadyExist = await this.userServices.findAll(user.email);

    if (userAlreadyExist.length > 0) {
      throw new ConflictException(
        `User with email ${user.email} already exists`,
      );
    }

    return await this.userServices.create(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.userServices.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IUser | null> {
    const user = await this.userServices.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<IUser | null> {
    const user = await this.userServices.update({ ...userData, id });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const user = await this.userServices.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    await this.userServices.delete(id);

    return true;
  }
}
