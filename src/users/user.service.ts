import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EUser } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(EUser)
    private userRepository: Repository<EUser>,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: IUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = this.userRepository.create({ ...user, password: hashedPassword });
  
    const savedUser = await this.userRepository.save(newUser);

    delete savedUser.password;
    
    return savedUser;
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

  async verify(body: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });
console.log(token);

    return token;
  }
}
