import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;

  // Test data
  const testCreatePostDto: CreatePostDto = {
    title: 'Test Post',
  };

  const testUpdatePostDto: UpdatePostDto = {
    title: 'Updated Post',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PrismaService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const result = await service.create(testCreatePostDto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(testCreatePostDto.title);
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });
  });

  describe('findAll', () => {
    it('should return all posts ordered by created_at desc', async () => {
      // Create a test post first
      await service.create(testCreatePostDto);

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Check if posts are ordered by created_at desc
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].created_at.getTime()).toBeGreaterThanOrEqual(
            result[i + 1].created_at.getTime(),
          );
        }
      }
    });
  });

  describe('findOne', () => {
    it('should return a post when found', async () => {
      // Create a test post first
      const createdPost = await service.create(testCreatePostDto);

      const result = await service.findOne(createdPost.id);

      expect(result).toEqual(createdPost);
    });

    it('should throw NotFoundException when post is not found', async () => {
      const nonExistentId = 999999; // Use a very large ID that likely doesn't exist

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        new NotFoundException(`Post with ID ${nonExistentId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a post when it exists', async () => {
      // Create a test post first
      const createdPost = await service.create(testCreatePostDto);

      const result = await service.update(createdPost.id, testUpdatePostDto);

      expect(result.id).toBe(createdPost.id);
      expect(result.title).toBe(testUpdatePostDto.title);
      expect(result.updated_at.getTime()).toBeGreaterThan(
        createdPost.updated_at.getTime(),
      );
    });

    it('should throw NotFoundException when trying to update non-existing post', async () => {
      const nonExistentId = 999999;

      await expect(
        service.update(nonExistentId, testUpdatePostDto),
      ).rejects.toThrow(
        new NotFoundException(`Post with ID ${nonExistentId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should delete a post when it exists', async () => {
      // Create a test post first
      const createdPost = await service.create(testCreatePostDto);

      const result = await service.remove(createdPost.id);

      expect(result).toEqual(createdPost);

      // Verify the post is actually deleted
      await expect(service.findOne(createdPost.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when trying to delete non-existing post', async () => {
      const nonExistentId = 999999;

      await expect(service.remove(nonExistentId)).rejects.toThrow(
        new NotFoundException(`Post with ID ${nonExistentId} not found`),
      );
    });
  });
});
