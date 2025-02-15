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

@Controller('api/users/')
export class UsersController {
  constructor(private userServices: UsersService) {}

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

  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.userServices.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IUser | null> {
    const user = await this.userServices.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

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
