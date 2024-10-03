import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { WistiaVideoListItemResponse } from 'src/dtos/wistia-video-list-item-response';
import { WistiaVideoDetailResponse } from 'src/dtos/wistia-video-detail-response';
import { WistiaVideoStatsResponse } from 'src/dtos/wistia-video-stats-response';
import { AxiosResponse } from 'axios';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            put: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-wistia-token'),
          },
        },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);
    httpService = module.get<HttpService>(HttpService);

    // just so we don't see the console.error output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('fetchVideos', () => {
    it('should fetch the list of videos from Wistia', async () => {
      const mockResponse = {
        data: [{ hashed_id: 'abc123', name: 'Test Video' }],
      } as Partial<AxiosResponse<WistiaVideoListItemResponse[]>>;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(
          of(mockResponse as AxiosResponse<WistiaVideoListItemResponse[]>),
        );

      const result = await service.fetchVideos();

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.wistia.com/v1/medias.json',
        {
          headers: {
            Authorization: 'Bearer fake-wistia-token',
            Accept: 'application/json',
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if fetching videos fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(new Error('Request failed')));

      await expect(service.fetchVideos()).rejects.toThrow(
        'Failed to fetch videos from Wistia',
      );
    });
  });

  describe('fetchVideoDetails', () => {
    it('should fetch detailed information for a specific video', async () => {
      const mockResponse = {
        data: { hashed_id: 'abc123', name: 'Test Video', tags: [] },
      } as Partial<AxiosResponse<WistiaVideoDetailResponse>>;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(
          of(mockResponse as AxiosResponse<WistiaVideoDetailResponse>),
        );

      const result = await service.fetchVideoDetails('abc123');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.wistia.com/v1/medias/abc123.json',
        {
          headers: {
            Authorization: 'Bearer fake-wistia-token',
            Accept: 'application/json',
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if fetching video details fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(new Error('Request failed')));

      await expect(service.fetchVideoDetails('abc123')).rejects.toThrow(
        'Failed to fetch video details from Wistia',
      );
    });
  });

  describe('fetchVideoStats', () => {
    it('should fetch video stats for a specific video', async () => {
      const mockResponse = {
        data: { stats: { plays: 100 } },
      } as Partial<AxiosResponse<any>>;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(mockResponse as AxiosResponse<any>));

      const result = await service.fetchVideoStats('abc123');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.wistia.com/v1/medias/abc123/stats.json',
        {
          headers: {
            Authorization: 'Bearer fake-wistia-token',
            Accept: 'application/json',
          },
        },
      );
      expect(result).toEqual(new WistiaVideoStatsResponse({ plays: 100 }));
    });

    it('should throw an error if fetching video stats fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(new Error('Request failed')));

      await expect(service.fetchVideoStats('abc123')).rejects.toThrow(
        'Failed to fetch video stats from Wistia',
      );
    });
  });

  describe('addTags', () => {
    it('should update tags for a specific video', async () => {
      const mockResponse = {
        data: undefined,
      } as Partial<AxiosResponse<void>>;

      jest
        .spyOn(httpService, 'put')
        .mockReturnValue(of(mockResponse as AxiosResponse<void>));

      await service.addTags('abc123', ['tag1', 'tag2']);

      expect(httpService.put).toHaveBeenCalledWith(
        'https://api.wistia.com/v1/medias/abc123.json',
        { tags: ['tag1', 'tag2'] },
        {
          headers: {
            Authorization: 'Bearer fake-wistia-token',
            Accept: 'application/json',
          },
        },
      );
    });

    it('should throw an error if updating tags fails', async () => {
      jest
        .spyOn(httpService, 'put')
        .mockReturnValue(throwError(new Error('Request failed')));

      await expect(service.addTags('abc123', ['tag1', 'tag2'])).rejects.toThrow(
        'Failed to update tags on Wistia',
      );
    });
  });
});
