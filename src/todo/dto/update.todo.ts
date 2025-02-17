import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    example: 'Watch a movie',
    description: 'Updated title of the todo',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Watch an action movie',
    description: 'Updated description of the todo',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Status of the todo (completed or not)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
