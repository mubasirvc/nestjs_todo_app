import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('api/users/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
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

  @Get('users/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@Res() res: Response): void {
    res.cookie('userToken', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }
}
