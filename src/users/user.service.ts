import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EUser } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(EUser)
    private userRepository: Repository<EUser>,
  ) {}

  async create(user: IUser): Promise<IUser> {
    const newUser = await this.userRepository.save(
      this.userRepository.create(user),
    );
    delete newUser.password;
    return newUser;
  }

  async findOne(id: number): Promise<IUser | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAll(email?: string): Promise<IUser[]> {
    return await this.userRepository.find({ where: { email } });
  }

  async update(userData: Partial<IUser>): Promise<IUser | null> {
    const { id, name } = userData;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    if (name) user.name = name;

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async delete(id: number): Promise<boolean> {
    await this.userRepository.delete(id);
    return true;
  }
}
