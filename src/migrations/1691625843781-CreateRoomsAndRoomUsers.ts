import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRoomsAndRoomUsers1691625843781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create rooms table
    await queryRunner.createTable(
      new Table({
        name: 'rooms',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lyricId',
            type: 'integer',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isClosed',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    // Create room_users table
    await queryRunner.createTable(
      new Table({
        name: 'room_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'integer',
          },
          {
            name: 'roomId',
            type: 'uuid',
          },
          {
            name: 'hasGuessed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'score',
            type: 'float',
            default: 0,
          },
          {
            name: 'guess',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'joinedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'guessedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'rooms',
      new TableForeignKey({
        columnNames: ['lyricId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lyrics',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'room_users',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'room_users',
      new TableForeignKey({
        columnNames: ['roomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('room_users');
    await queryRunner.dropTable('rooms');
  }
}
