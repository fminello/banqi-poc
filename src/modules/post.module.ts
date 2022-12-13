import { Module } from '@nestjs/common';
import { PostController } from 'src/controllers/post.controller';
import { PrismaService } from 'src/services/prisma.service';
import { PostService } from 'src/services/post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [PrismaService],
})
export class PostModule {}
