import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Watch a movie',
    description: 'Title of the to-do item',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Watch an action movie on Friday night',
    description: 'Detailed description of the to-do item',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the to-do is completed',
  })
  @IsBoolean()
  isCompleted: boolean;
}
