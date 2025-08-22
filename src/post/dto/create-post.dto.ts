/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
