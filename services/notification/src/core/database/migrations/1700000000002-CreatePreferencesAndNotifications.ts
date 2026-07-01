import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePreferencesAndNotifications1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'notification_preferences',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: 'org_id', type: 'uuid', isNullable: false },
        { name: 'user_id', type: 'uuid', isNullable: false },
        { name: 'event_type', type: 'varchar', length: '100', isNullable: false },
        { name: 'email_enabled', type: 'boolean', default: true },
        { name: 'sms_enabled', type: 'boolean', default: false },
        { name: 'push_enabled', type: 'boolean', default: true },
        { name: 'in_app_enabled', type: 'boolean', default: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      ],
    }), true);
    await queryRunner.createIndex('notification_preferences', new TableIndex({ name: 'IDX_PREF_USER_EVENT', columnNames: ['user_id', 'event_type'], isUnique: true }));

    await queryRunner.createTable(new Table({
      name: 'notifications',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: 'org_id', type: 'uuid', isNullable: false },
        { name: 'user_id', type: 'uuid', isNullable: false },
        { name: 'event_type', type: 'varchar', length: '100', isNullable: false },
        { name: 'title', type: 'varchar', length: '255', isNullable: false },
        { name: 'body', type: 'text', isNullable: true },
        { name: 'action_url', type: 'varchar', length: '500', isNullable: true },
        { name: 'is_read', type: 'boolean', default: false },
        { name: 'read_at', type: 'timestamp', isNullable: true },
        { name: 'metadata', type: 'jsonb', default: "'{}'" },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      ],
    }), true);
    await queryRunner.createIndex('notifications', new TableIndex({ name: 'IDX_NOTIF_USER_READ', columnNames: ['user_id', 'is_read'] }));
    await queryRunner.createIndex('notifications', new TableIndex({ name: 'IDX_NOTIF_ORG_USER', columnNames: ['org_id', 'user_id'] }));

    await queryRunner.createTable(new Table({
      name: 'delivery_logs',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: 'org_id', type: 'uuid', isNullable: false },
        { name: 'user_id', type: 'uuid', isNullable: false },
        { name: 'channel', type: 'varchar', length: '20', isNullable: false },
        { name: 'event_type', type: 'varchar', length: '100', isNullable: false },
        { name: 'status', type: 'varchar', length: '20', isNullable: false },
        { name: 'provider', type: 'varchar', length: '50', isNullable: true },
        { name: 'provider_message_id', type: 'varchar', length: '255', isNullable: true },
        { name: 'error_message', type: 'text', isNullable: true },
        { name: 'retry_count', type: 'int', default: 0 },
        { name: 'event_id', type: 'varchar', length: '64', isNullable: true, isUnique: true },
        { name: 'sent_at', type: 'timestamp', isNullable: true },
        { name: 'delivered_at', type: 'timestamp', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      ],
    }), true);
    await queryRunner.createIndex('delivery_logs', new TableIndex({ name: 'IDX_DELIVERY_EVENT', columnNames: ['event_id'], isUnique: true }));
    await queryRunner.createIndex('delivery_logs', new TableIndex({ name: 'IDX_DELIVERY_STATUS', columnNames: ['status'] }));

    await queryRunner.createTable(new Table({
      name: 'device_tokens',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: 'user_id', type: 'uuid', isNullable: false },
        { name: 'platform', type: 'varchar', length: '20', isNullable: false },
        { name: 'token', type: 'text', isNullable: false },
        { name: 'is_active', type: 'boolean', default: true },
        { name: 'last_used_at', type: 'timestamp', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      ],
    }), true);
    await queryRunner.createIndex('device_tokens', new TableIndex({ name: 'IDX_DEVICE_USER', columnNames: ['user_id'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('device_tokens');
    await queryRunner.dropTable('delivery_logs');
    await queryRunner.dropTable('notifications');
    await queryRunner.dropTable('notification_preferences');
  }
}
