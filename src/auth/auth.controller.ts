import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/user.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('api/users/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const token = await this.userService.verify(body);

      res.cookie('userToken', token, { httpOnly: true });
      return res.json({ message: 'Login successful' });

    } catch (error) {
      if (error instanceof NotFoundException)
        return res.status(404).json({ message: 'User not found' });

      if (error instanceof UnauthorizedException)
        return res.status(401).json({ message: 'Invalid email or password' });

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
