import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { ApiClientModule } from 'src/api-client/api-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { RedisModule } from 'src/redis/redis.module';
import { ApiClientService } from 'src/api-client/api-client.service';
import { HttpModule } from '@nestjs/axios';
import { Tag } from 'src/tags/tag.entity';
import { SyncService } from 'src/sync/sync-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Tag]), // Provide VideoRepository
    RedisModule, // Import RedisModule for Redis injection
    HttpModule, // Import HttpModule to provide HttpService
  ],
  controllers: [VideosController],
  providers: [VideosService, ApiClientService, SyncService],
})
export class VideosModule {}
