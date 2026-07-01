import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotifications1700000000003 implements MigrationInterface {
  name = 'CreateNotifications1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'org_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'event_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'body',
            type: 'text',
          },
          {
            name: 'action_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'read_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            default: "'{}'",
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
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIF_USER_READ',
        columnNames: ['user_id', 'is_read'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIF_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIF_CREATED',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('notifications', 'IDX_NOTIF_CREATED');
    await queryRunner.dropIndex('notifications', 'IDX_NOTIF_ORG_USER');
    await queryRunner.dropIndex('notifications', 'IDX_NOTIF_USER_READ');
    await queryRunner.dropTable('notifications');
  }
}
