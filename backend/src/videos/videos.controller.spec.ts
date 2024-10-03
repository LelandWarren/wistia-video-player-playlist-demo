import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { SyncService } from 'src/sync/sync-service';
import { VideoDTO } from './video.dto';
import { plainToClass } from 'class-transformer';

describe('VideosController', () => {
  let controller: VideosController;
  let videosService: VideosService;
  let syncService: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: VideosService,
          useValue: {
            getPlaylist: jest.fn(),
            toggleVisibility: jest.fn(),
            addTag: jest.fn(),
          },
        },
        {
          provide: SyncService,
          useValue: {
            syncWistiaVideos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideosController>(VideosController);
    videosService = module.get<VideosService>(VideosService);
    syncService = module.get<SyncService>(SyncService);
  });

  describe('getPlaylist', () => {
    it('should call VideosService.getPlaylist and transform to VideoDTO array', async () => {
      const videos = [
        {
          id: 1,
          wistiaHashedId: 'abc123',
          title: 'Test Video',
          visible: true,
        } as any,
      ];

      jest.spyOn(videosService, 'getPlaylist').mockResolvedValue(videos);

      const result = await controller.getPlaylist('false');

      expect(videosService.getPlaylist).toHaveBeenCalledWith(false);

      expect(result).toEqual(
        videos.map((video) => plainToClass(VideoDTO, video)),
      );
    });
  });

  describe('toggleVisibility', () => {
    it('should call VideosService.toggleVisibility and return transformed VideoDTO', async () => {
      const video = {
        id: 1,
        wistiaHashedId: 'abc123',
        title: 'Test Video',
        visible: false,
      } as any;

      jest.spyOn(videosService, 'toggleVisibility').mockResolvedValue(video);

      const result = await controller.toggleVisibility(1);

      expect(videosService.toggleVisibility).toHaveBeenCalledWith(1);

      expect(result).toEqual(plainToClass(VideoDTO, video));
    });
  });
});
