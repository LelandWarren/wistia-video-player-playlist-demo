import { Tag } from 'src/tags/tag.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  wistiaHashedId: string;

  @Column()
  title: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 16, scale: 4 })
  duration: number;

  // Stats
  @Column({ default: 0 })
  plays: number;

  // Visible attribute
  @Column({ default: true }) // By default, videos will be visible
  @Index()
  visible: boolean;

  @ManyToMany(() => Tag, (tag) => tag.videos, { cascade: true })
  @JoinTable({
    name: 'video_tags',
    joinColumn: { name: 'videoId' },
    inverseJoinColumn: { name: 'tagId' },
  })
  tags: Tag[];
}
