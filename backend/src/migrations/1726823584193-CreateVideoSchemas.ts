import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideoSchemas1726823584193 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "video" (
        "id" SERIAL NOT NULL, 
        "wistiaHashedId" character varying NOT NULL, 
        "title" character varying NOT NULL, 
        "duration" decimal NOT NULL, 
        "thumbnailUrl" character varying NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL, 
        "plays" integer NOT NULL DEFAULT '0',  
        "visible" boolean NOT NULL DEFAULT true, 
        CONSTRAINT "PK_d7a14a2fcbef1f00bd7a3be1309" PRIMARY KEY ("id")
      )`,
    );

    // Add an index on wistiaHashedId for faster lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_wistia_hashed_id" ON "video" ("wistiaHashedId")`,
    );

    // Add an index on visible for efficient filtering
    await queryRunner.query(
      `CREATE INDEX "IDX_video_visible" ON "video" ("visible")`,
    );
  }

  // I'm not going to implement the down method for this migration since I don't plan to revert it in this example
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
