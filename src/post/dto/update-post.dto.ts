/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  title: string;
}
