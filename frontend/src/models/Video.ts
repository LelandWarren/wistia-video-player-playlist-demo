import { Utils } from "@/utils/utils";

export class Video {
  id: number;
  hashedId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  durationFormatted: string;
  visible: boolean;
  plays: number;
  tags: { name: string }[];

  constructor(data: any) {
    this.id = data.id;
    this.hashedId = data.hashedId || data.wistiaHashedId;
    this.title = data.title;
    this.description = data.description;
    this.thumbnailUrl = data.thumbnailUrl;
    this.duration = data.duration;
    this.durationFormatted = Utils.formatTime(data.duration);
    this.visible = data.visible;
    this.plays = data.plays;
    this.tags = data.tags;
  }
}
