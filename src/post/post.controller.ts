import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Creates a new blog post with the provided title',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description:
      'Retrieves a list of all posts ordered by creation date (newest first)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all posts',
  })
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Retrieves a specific post by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the post',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the post',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found',
  })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Updates an existing post with the provided data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the post to update',
    example: 1,
  })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Post data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post has been successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Deletes a specific post by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the post to delete',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found',
  })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
