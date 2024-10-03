import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideoDTO } from './video.dto';
import { plainToClass } from 'class-transformer';
import { SyncService } from 'src/sync/sync-service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly syncService: SyncService,
  ) {}

  @Get()
  async getPlaylist(
    @Query('includeHidden') includeHidden: string,
  ): Promise<VideoDTO[]> {
    const videos = await this.videosService.getPlaylist(
      includeHidden === 'true',
    );
    return videos.map((video) => plainToClass(VideoDTO, video));
  }

  @Patch('sync')
  async syncVideos(): Promise<void> {
    await this.syncService.syncWistiaVideos();
  }

  @Patch(':id/visibility')
  async toggleVisibility(@Param('id') id: number): Promise<VideoDTO> {
    const updatedVideo = await this.videosService.toggleVisibility(id);
    return plainToClass(VideoDTO, updatedVideo);
  }

  @Patch(':id/tags')
  async addTag(
    @Param('id') id: number,
    @Body('tagName') tagName: string,
  ): Promise<void> {
    await this.videosService.addTag(id, tagName);
  }
}
