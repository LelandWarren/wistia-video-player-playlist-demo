import { IsString, IsBoolean, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class VideoDTO {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  hashedId: string;

  @IsString()
  @Expose()
  thumbnailUrl: string;

  @IsNumber()
  @Expose()
  plays: number;

  @IsBoolean()
  @Expose()
  visible: boolean;

  @IsNumber()
  @Expose()
  duration: number;

  @IsString({ each: true })
  @Expose()
  tags: string[];

  constructor(partial: Partial<VideoDTO>) {
    Object.assign(this, partial);
  }
}
