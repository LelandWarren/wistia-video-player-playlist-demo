import { DataSource } from 'typeorm';
import { Video } from 'src/videos/video.entity';
import { Tag } from './tags/tag.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'video_db',
  entities: [Video, Tag],
  migrations: ['src/migrations/*.ts'], // Use TS migrations
  synchronize: false,
});
