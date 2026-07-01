import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotificationPreferences1700000000002 implements MigrationInterface {
  name = 'CreateNotificationPreferences1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_preferences',
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
            name: 'email_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'sms_enabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'push_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'in_app_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'notification_preferences',
      new TableIndex({
        name: 'IDX_PREF_USER_EVENT',
        columnNames: ['user_id', 'event_type'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('notification_preferences', 'IDX_PREF_USER_EVENT');
    await queryRunner.dropTable('notification_preferences');
  }
}
