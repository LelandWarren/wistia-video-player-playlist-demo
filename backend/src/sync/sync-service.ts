import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../videos/video.entity';
import { ApiClientService } from '../api-client/api-client.service';
import { Tag } from '../tags/tag.entity';
import Redis from 'ioredis';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    private apiClientService: ApiClientService,

    @Inject('REDIS') private redisClient: Redis,
  ) {}

  /**
   * Synchronizes video data from the Wistia API to the database, including tags.
   */
  async syncWistiaVideos(): Promise<void> {
    const wistiaVideos = await this.apiClientService.fetchVideos(); // Fetch the list of videos

    const existingVideos = await this.videosRepository.find({
      relations: ['tags'],
    });
    const existingVideoMap = new Map(
      existingVideos.map((video) => [video.wistiaHashedId, video]),
    );

    for (const wistiaVideo of wistiaVideos) {
      const videoStats = await this.apiClientService.fetchVideoStats(
        wistiaVideo.hashed_id,
      );

      // Fetch detailed information (including tags) for the video
      const wistiaVideoDetails = await this.apiClientService.fetchVideoDetails(
        wistiaVideo.hashed_id,
      );
      const wistiaTags = Array.isArray(wistiaVideoDetails.tags)
        ? wistiaVideoDetails.tags.map((tag) => tag.name)
        : [];

      let videoEntity = existingVideoMap.get(wistiaVideo.hashed_id);

      if (!videoEntity) {
        videoEntity = this.videosRepository.create({
          wistiaHashedId: wistiaVideo.hashed_id,
          title: wistiaVideo.name,
          createdAt: new Date(wistiaVideo.created),
          thumbnailUrl: wistiaVideo.thumbnail.url,
          plays: videoStats.plays,
          visible: true,
          duration: wistiaVideo.duration,
        });
      } else {
        videoEntity.title = wistiaVideo.name;
        videoEntity.plays = videoStats.plays;
      }

      // Handle Tags
      const videoTags = await this.handleTags(wistiaTags);
      videoEntity.tags = videoTags;

      // Save the video entity with updated tags
      await this.videosRepository.save(videoEntity);
    }

    // Invalidate the cached playlist
    await this.redisClient.del('videos_playlist');
    await this.redisClient.del('videos_playlist_all');
  }

  /**
   * Handles tag creation and association for the video.
   * @param wistiaTags - Array of tag names from Wistia
   * @returns Array of Tag entities to be associated with the video.
   */
  private async handleTags(wistiaTags: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const tagName of wistiaTags) {
      let tag = await this.tagsRepository.findOne({ where: { name: tagName } });

      if (!tag) {
        // If the tag doesn't exist, create it
        tag = this.tagsRepository.create({ name: tagName });
        await this.tagsRepository.save(tag);
      }

      tags.push(tag); // Add to the list of tags for the video
    }

    return tags;
  }
}
