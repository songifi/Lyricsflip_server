import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserPreferences1755000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add preferredGenre column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'preferredGenre',
        type: 'enum',
        enum: [
          'Pop', 'Rock', 'Hip Hop', 'Rap', 'R&B', 'Country', 'Jazz', 'Blues',
          'Electronic', 'Dance', 'Reggae', 'Folk', 'Indie', 'Alternative',
          'Metal', 'Punk', 'Soul', 'Funk', 'Classical', 'World'
        ],
        isNullable: true,
      }),
    );

    // Add preferredDecade column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'preferredDecade',
        type: 'enum',
        enum: [
          '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
        ],
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove preferredDecade column
    await queryRunner.dropColumn('users', 'preferredDecade');
    
    // Remove preferredGenre column
    await queryRunner.dropColumn('users', 'preferredGenre');
  }
}
