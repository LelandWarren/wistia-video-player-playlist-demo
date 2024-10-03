import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Video } from './video.entity';
import { ApiClientService } from '../api-client/api-client.service';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    private apiClientService: ApiClientService,
    @Inject('REDIS') private redisClient: Redis,
  ) {}

  async getPlaylist(includeHidden: boolean): Promise<Video[]> {
    const cacheKey = includeHidden ? 'videos_playlist_all' : 'videos_playlist';

    const cachedPlaylist = await this.redisClient.get(cacheKey);
    if (cachedPlaylist) {
      return JSON.parse(cachedPlaylist);
    }

    const visibilityCondition = includeHidden ? {} : { visible: true };
    const videos = await this.videosRepository.find({
      where: visibilityCondition,
      relations: ['tags'],
    });

    await this.redisClient.set(cacheKey, JSON.stringify(videos), 'EX', 3600);

    return videos;
  }

  async toggleVisibility(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({ where: { id } });
    if (!video) {
      throw new Error('Video not found');
    }

    video.visible = !video.visible;
    await this.videosRepository.save(video);

    await this.redisClient.del('videos_playlist');
    await this.redisClient.del('videos_playlist_all');

    return video;
  }

  async addTag(videoId: number, tagName: string): Promise<void> {
    const video = await this.videosRepository.findOne({
      where: { id: videoId },
      relations: ['tags'],
    });
    if (!video) {
      throw new Error('Video not found');
    }

    let tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      tag = this.tagsRepository.create({ name: tagName });
      await this.tagsRepository.save(tag);
    }

    if (!video.tags.some((t) => t.id === tag.id)) {
      video.tags.push(tag);
      await this.videosRepository.save(video);
    }

    const allTagNames = video.tags.map((t) => t.name);
    await this.apiClientService.addTags(video.wistiaHashedId, allTagNames);

    await this.redisClient.del('videos_playlist');
    await this.redisClient.del('videos_playlist_all');
  }
}
