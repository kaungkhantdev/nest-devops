/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../../generated/prisma';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({
      data: createPostDto,
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      // First check if the post exists
      await this.findOne(id);

      return await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
      });
    } catch (error) {
      // Re-throw NotFoundException or handle Prisma errors
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: number): Promise<Post> {
    try {
      // First check if the post exists
      await this.findOne(id);

      return await this.prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      // Re-throw NotFoundException or handle Prisma errors
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
