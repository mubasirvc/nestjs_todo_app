import { Repository } from 'typeorm';
import { ETodo } from './entity/todo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITodo } from './interface/todo.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class TodoServices {
  constructor(
    @InjectRepository(ETodo)
    private todoRepository: Repository<ETodo>,
  ) {}

  async create(todo: ITodo, user: IUser): Promise<ETodo> {
    const newTodo = this.todoRepository.create({ ...todo, user });
    return this.todoRepository.save(newTodo);
  }

  async findAll(userId: number): Promise<ETodo[]> {
    return await this.todoRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<ETodo> {
    return await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(data: ITodo): Promise<ETodo> {
    const todo = await this.todoRepository.findOneBy({ id: data.id });
    if (!todo) return null;

    const { title, description, isCompleted } = data;

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (typeof isCompleted === 'boolean') {
      todo.isCompleted = isCompleted;
    }

    return await this.todoRepository.save(todo);
  }

  async delete(id: number): Promise<boolean> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) return false;

    await this.todoRepository.delete(id);
    return true;
  }
}
