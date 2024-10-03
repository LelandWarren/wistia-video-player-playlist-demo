import { ApiService } from "./ApiService";
import { Video } from "@/models/Video";

export class VideoService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  async getVideos(includeHidden = false): Promise<Video[]> {
    try {
      const response = await this.apiService.http.get(`/videos`, {
        params: {
          includeHidden,
        },
      });
      const videos = response.data.map((video: any) => new Video(video));
      return videos;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch the video: " + error.message);
      } else {
        throw new Error("Failed to fetch the video: An unknown error occurred");
      }
    }
  }

  async toggleVisibility(videoId: number): Promise<Video> {
    try {
      const response = await this.apiService.http.patch(
        `/videos/${videoId}/visibility`
      );
      return new Video(response.data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to toggle visibility: " + error.message);
      } else {
        throw new Error(
          "Failed to toggle visibility: An unknown error occurred"
        );
      }
    }
  }

  async addTag(videoId: number, tagName: string): Promise<void> {
    try {
      await this.apiService.http.patch(`/videos/${videoId}/tags`, {
        tagName, // Send { tagName: 'someTag' }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to add tag: " + error.message);
      } else {
        throw new Error("Failed to add tag: An unknown error occurred");
      }
    }
  }
}

export const videoService = new VideoService();
