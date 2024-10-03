import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WistiaVideoListItemResponse } from 'src/dtos/wistia-video-list-item-response';
import { WistiaVideoStatsResponse } from 'src/dtos/wistia-video-stats-response';
import { WistiaVideoDetailResponse } from 'src/dtos/wistia-video-detail-response';

@Injectable()
export class ApiClientService {
  private readonly wistiaApiUrl = 'https://api.wistia.com/v1';
  private readonly wistiaApiToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Get the Wistia API token from the environment variables (or config)
    this.wistiaApiToken = this.configService.get<string>('WISTIA_API_TOKEN');
  }

  /**
   * Fetches a list of videos from the Wistia API (without detailed information like tags).
   * @returns {Promise<WistiaVideoListItemResponse[]>} The list of videos from Wistia.
   */
  async fetchVideos(): Promise<WistiaVideoListItemResponse[]> {
    const url = `${this.wistiaApiUrl}/medias.json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WistiaVideoListItemResponse[]>(url, {
          headers: {
            Authorization: `Bearer ${this.wistiaApiToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching videos from Wistia API:', error);
      throw new Error('Failed to fetch videos from Wistia');
    }
  }

  /**
   * Fetches detailed information (including tags) for a specific video from Wistia.
   * @param {string} hashedId - The Wistia hashed ID for the video.
   * @returns {Promise<WistiaVideoDetailResponse>} The detailed information including tags.
   */
  async fetchVideoDetails(
    hashedId: string,
  ): Promise<WistiaVideoDetailResponse> {
    const url = `${this.wistiaApiUrl}/medias/${hashedId}.json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WistiaVideoDetailResponse>(url, {
          headers: {
            Authorization: `Bearer ${this.wistiaApiToken}`,
            Accept: 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching details for video with hashedId ${hashedId}:`,
        error,
      );
      throw new Error('Failed to fetch video details from Wistia');
    }
  }

  /**
   * Fetches stats for a specific video from the Wistia API.
   *
   * @param {string} hashedId - The Wistia hashed ID for the video.
   * @returns {Promise<WistiaVideoStatsResponse>} The stats for the video.
   */
  async fetchVideoStats(hashedId: string): Promise<WistiaVideoStatsResponse> {
    const url = `${this.wistiaApiUrl}/medias/${hashedId}/stats.json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.wistiaApiToken}`,
            Accept: 'application/json',
          },
        }),
      );

      const stats = response.data.stats || {};

      // Map the response to WistiaVideoStatsResponse
      return new WistiaVideoStatsResponse({
        plays: stats.plays || 0,
      });
    } catch (error) {
      console.error(
        `Error fetching stats for video with hashedId ${hashedId}:`,
        error,
      );
      throw new Error('Failed to fetch video stats from Wistia');
    }
  }

  /**
   * Updates the tags for a specific video on Wistia.
   * @param hashedId - The Wistia hashed ID of the video.
   * @param tags - The full list of tags to update.
   */
  async addTags(hashedId: string, tags: string[]): Promise<void> {
    const url = `${this.wistiaApiUrl}/medias/${hashedId}.json`;

    try {
      await firstValueFrom(
        this.httpService.put(
          url,
          { tags }, // Wistia requires replacing all tags
          {
            headers: {
              Authorization: `Bearer ${this.wistiaApiToken}`,
              Accept: 'application/json',
            },
          },
        ),
      );
    } catch (error) {
      console.error(
        `Error updating tags for video with hashedId ${hashedId}:`,
        error,
      );
      throw new Error('Failed to update tags on Wistia');
    }
  }
}
