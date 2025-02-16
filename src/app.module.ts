import { Module } from '@nestjs/common';
import { UsersService } from './users/user.service';
import { UsersModule } from './users/user.module';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    TodoModule,
    AuthModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
    }),
  ],
  controllers: [],
  providers: [UsersService, JwtService],
})
export class AppModule {}
