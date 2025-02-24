import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Updated name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
