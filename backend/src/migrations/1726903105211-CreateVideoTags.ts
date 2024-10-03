import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateVideoTags1726903105211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the tags table
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
        ],
      }),
    );

    // Create the video_tags join table
    await queryRunner.createTable(
      new Table({
        name: 'video_tags',
        columns: [
          {
            name: 'videoId',
            type: 'int',
          },
          {
            name: 'tagId',
            type: 'int',
          },
        ],
      }),
    );

    // Add foreign key for video_tags.videoId to video.id
    await queryRunner.createForeignKey(
      'video_tags',
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'video',
      }),
    );

    // Add foreign key for video_tags.tagId to tags.id
    await queryRunner.createForeignKey(
      'video_tags',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
