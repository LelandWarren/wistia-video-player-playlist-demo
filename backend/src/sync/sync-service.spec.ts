import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync-service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from '../videos/video.entity';
import { Tag } from '../tags/tag.entity';
import { ApiClientService } from '../api-client/api-client.service';
import { Redis } from 'ioredis';
import { WistiaVideoListItemResponse } from 'src/dtos/wistia-video-list-item-response';
import { WistiaVideoDetailResponse } from 'src/dtos/wistia-video-detail-response';
import { WistiaVideoStatsResponse } from 'src/dtos/wistia-video-stats-response';

describe('SyncService', () => {
  let service: SyncService;
  let videosRepository: Repository<Video>;
  let tagsRepository: Repository<Tag>;
  let apiClientService: ApiClientService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: ApiClientService,
          useValue: {
            fetchVideos: jest.fn(),
            fetchVideoStats: jest.fn(),
            fetchVideoDetails: jest.fn(),
          },
        },
        {
          provide: 'REDIS',
          useValue: {
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    videosRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
    tagsRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    apiClientService = module.get<ApiClientService>(ApiClientService);
    redisClient = module.get<Redis>('REDIS');

    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('syncWistiaVideos', () => {
    it('should sync videos from Wistia and update the database', async () => {
      // Mock the Wistia API responses
      const wistiaVideos: WistiaVideoListItemResponse[] = [
        {
          hashed_id: 'abc123',
          name: 'Test Video',
          created: '2024-01-01T00:00:00Z',
          thumbnail: { url: 'thumbnail-url' },
          duration: 120,
          tags: [], // Add an empty array for tags
        },
      ];

      const videoStats: WistiaVideoStatsResponse = {
        plays: 100,
      };

      const wistiaVideoDetails: WistiaVideoDetailResponse = {
        hashed_id: 'abc123',
        name: 'Test Video',
        created: '2024-01-01T00:00:00Z',
        thumbnail: { url: 'thumbnail-url' },
        tags: [{ name: 'Tag1' }, { name: 'Tag2' }],
      };

      // Mock API calls
      jest
        .spyOn(apiClientService, 'fetchVideos')
        .mockResolvedValue(wistiaVideos);
      jest
        .spyOn(apiClientService, 'fetchVideoStats')
        .mockResolvedValue(videoStats);
      jest
        .spyOn(apiClientService, 'fetchVideoDetails')
        .mockResolvedValue(wistiaVideoDetails);

      // Mock existing video and tag behavior
      jest.spyOn(videosRepository, 'find').mockResolvedValue([]);
      jest
        .spyOn(videosRepository, 'create')
        .mockImplementation((data) => data as Video);
      jest.spyOn(videosRepository, 'save').mockResolvedValue({} as Video);
      jest.spyOn(tagsRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(tagsRepository, 'create')
        .mockImplementation((data) => data as Tag);
      jest.spyOn(tagsRepository, 'save').mockResolvedValue({} as Tag);

      await service.syncWistiaVideos();

      // Check if API calls were made
      expect(apiClientService.fetchVideos).toHaveBeenCalled();
      expect(apiClientService.fetchVideoStats).toHaveBeenCalledWith('abc123');
      expect(apiClientService.fetchVideoDetails).toHaveBeenCalledWith('abc123');

      // Check if video was created and saved
      expect(videosRepository.create).toHaveBeenCalledWith({
        wistiaHashedId: 'abc123',
        title: 'Test Video',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        thumbnailUrl: 'thumbnail-url',
        plays: 100,
        visible: true,
        duration: 120,
        tags: [{ name: 'Tag1' }, { name: 'Tag2' }],
      });

      expect(videosRepository.save).toHaveBeenCalled();

      // Check if tags were handled correctly
      expect(tagsRepository.create).toHaveBeenCalledWith({ name: 'Tag1' });
      expect(tagsRepository.create).toHaveBeenCalledWith({ name: 'Tag2' });
      expect(tagsRepository.save).toHaveBeenCalledTimes(2);

      // Check if Redis cache was invalidated
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist');
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist_all');
    });

    it('should update existing videos instead of creating new ones', async () => {
      const existingVideo = {
        wistiaHashedId: 'abc123',
        title: 'Old Title',
        plays: 50,
        tags: [],
      } as Video;

      const wistiaVideos: WistiaVideoListItemResponse[] = [
        {
          hashed_id: 'abc123',
          name: 'New Title',
          created: '2024-01-01T00:00:00Z',
          thumbnail: { url: 'thumbnail-url' },
          duration: 120,
          tags: [], // Add an empty array for tags
        },
      ];

      const videoStats: WistiaVideoStatsResponse = {
        plays: 100,
      };

      const wistiaVideoDetails: WistiaVideoDetailResponse = {
        hashed_id: 'abc123',
        name: 'New Title',
        created: '2024-01-01T00:00:00Z',
        thumbnail: { url: 'thumbnail-url' },
        tags: [{ name: 'Tag1' }, { name: 'Tag2' }],
      };

      jest
        .spyOn(apiClientService, 'fetchVideos')
        .mockResolvedValue(wistiaVideos);
      jest
        .spyOn(apiClientService, 'fetchVideoStats')
        .mockResolvedValue(videoStats);
      jest
        .spyOn(apiClientService, 'fetchVideoDetails')
        .mockResolvedValue(wistiaVideoDetails);

      jest.spyOn(videosRepository, 'find').mockResolvedValue([existingVideo]);
      jest.spyOn(videosRepository, 'save').mockResolvedValue(existingVideo);
      jest.spyOn(videosRepository, 'create').mockReturnValue(existingVideo);

      jest.spyOn(tagsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(tagsRepository, 'create').mockReturnValue({} as Tag);
      jest.spyOn(tagsRepository, 'save').mockResolvedValue({} as Tag);

      await service.syncWistiaVideos();

      // Ensure existing video is updated
      expect(videosRepository.save).toHaveBeenCalledWith({
        wistiaHashedId: 'abc123',
        title: 'New Title',
        plays: 100,
        tags: [{}, {}], // I'm just not worrying about the tags here
      });

      // Check that Redis cache is invalidated
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist');
      expect(redisClient.del).toHaveBeenCalledWith('videos_playlist_all');
    });
  });

  describe('handleTags', () => {
    it('should create new tags if they do not exist', async () => {
      jest.spyOn(tagsRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(tagsRepository, 'create')
        .mockImplementation((data) => data as Tag);
      jest.spyOn(tagsRepository, 'save').mockResolvedValue({} as Tag);

      const tags = await service['handleTags'](['Tag1', 'Tag2']);

      expect(tagsRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Tag1' },
      });
      expect(tagsRepository.create).toHaveBeenCalledWith({ name: 'Tag1' });
      expect(tagsRepository.save).toHaveBeenCalled();

      expect(tags).toEqual([{ name: 'Tag1' }, { name: 'Tag2' }]);
    });

    it('should return existing tags if they already exist', async () => {
      const existingTag = { id: 1, name: 'Tag1' } as Tag;
      jest.spyOn(tagsRepository, 'findOne').mockResolvedValue(existingTag);

      const tags = await service['handleTags'](['Tag1']);

      expect(tagsRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Tag1' },
      });
      expect(tags).toEqual([existingTag]);
    });
  });
});
