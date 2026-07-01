import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDeviceTokens1700000000005 implements MigrationInterface {
  name = 'CreateDeviceTokens1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'device_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'platform',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'token',
            type: 'text',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_used_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'device_tokens',
      new TableIndex({
        name: 'IDX_DEVICE_USER',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('device_tokens', 'IDX_DEVICE_USER');
    await queryRunner.dropTable('device_tokens');
  }
}
