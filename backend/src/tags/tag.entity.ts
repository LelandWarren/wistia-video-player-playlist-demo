import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Video } from '../videos/video.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Video, (video) => video.tags)
  videos: Video[];
}
