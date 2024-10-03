import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { Tag } from 'src/tags/tag.entity';
import { Redis } from 'ioredis';
import { ApiClientService } from '../api-client/api-client.service';

describe('VideosService', () => {
  let service: VideosService;
  let videosRepository: Repository<Video>;
  let tagsRepository: Repository<Tag>;
  let redisClient: Redis;
  let apiClientService: ApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: 'REDIS',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: ApiClientService,
          useValue: {
            addTags: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    videosRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
    tagsRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    redisClient = module.get<Redis>('REDIS');
    apiClientService = module.get<ApiClientService>(ApiClientService);
  });

  describe('getPlaylist', () => {
    it('should return cached playlist if available', async () => {
      const cachedPlaylist = JSON.stringify([{ id: 1, title: 'Test Video' }]);
      jest.spyOn(redisClient, 'get').mockResolvedValue(cachedPlaylist);

      const result = await service.getPlaylist(false);

      expect(redisClient.get).toHaveBeenCalledWith('videos_playlist');
      expect(result).toEqual(JSON.parse(cachedPlaylist));
    });

    it('should fetch and cache playlist if not available in cache', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue(null);
      jest.spyOn(videosRepository, 'find').mockResolvedValue([
        {
          id: 1,
          wistiaHashedId: 'abc123',
          title: 'Test Video',
          tags: [],
          visible: true,
          plays: 0,
          thumbnailUrl: 'url',
          duration: 10,
        },
      ] as Video[]);

      const result = await service.getPlaylist(false);

      expect(videosRepository.find).toHaveBeenCalledWith({
        where: { visible: true },
        relations: ['tags'],
      });
      expect(redisClient.set).toHaveBeenCalledWith(
        'videos_playlist',
        JSON.stringify(result),
        'EX',
        3600,
      );
      expect(result).toEqual([
        {
          id: 1,
          wistiaHashedId: 'abc123',
          title: 'Test Video',
          tags: [],
          visible: true,
          plays: 0,
          thumbnailUrl: 'url',
          duration: 10,
        },
      ]);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle the visibility of a video and invalidate the cache', async () => {
      const video = { id: 1, visible: true } as Video;
      jest.spyOn(videosRepository, 'findOne').mockResolvedValue(video);
      jest.spyOn(videosRepository, 'save').mockResolvedValue(video);

      const result = await service.toggleVisibility(1);

      expect(videosRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(videosRepository.save).toHaveBeenCalledWith({
        ...video,
        visible: false,
      });
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist');
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist_all');
      expect(result.visible).toBe(false);
    });

    it('should throw an error if video is not found', async () => {
      jest.spyOn(videosRepository, 'findOne').mockResolvedValue(null);

      await expect(service.toggleVisibility(999)).rejects.toThrow(
        'Video not found',
      );
    });
  });

  describe('addTag', () => {
    it('should add a new tag to a video and invalidate the cache', async () => {
      const video = { id: 1, wistiaHashedId: 'abc123', tags: [] } as Video;
      const tag = { id: 1, name: 'New Tag' } as Tag;

      jest.spyOn(videosRepository, 'findOne').mockResolvedValue(video);
      jest.spyOn(tagsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(tagsRepository, 'create').mockReturnValue(tag);
      jest.spyOn(tagsRepository, 'save').mockResolvedValue(tag);
      jest.spyOn(apiClientService, 'addTags').mockResolvedValue();
      jest.spyOn(videosRepository, 'save').mockResolvedValue(video);

      await service.addTag(1, 'New Tag');

      expect(tagsRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'New Tag' },
      });
      expect(tagsRepository.create).toHaveBeenCalledWith({ name: 'New Tag' });
      expect(tagsRepository.save).toHaveBeenCalledWith(tag);
      expect(video.tags).toContain(tag);
      expect(apiClientService.addTags).toHaveBeenCalledWith('abc123', [
        'New Tag',
      ]);
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist');
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist_all');
    });

    it('should throw an error if video is not found', async () => {
      jest.spyOn(videosRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addTag(999, 'New Tag')).rejects.toThrow(
        'Video not found',
      );
    });
  });
});
