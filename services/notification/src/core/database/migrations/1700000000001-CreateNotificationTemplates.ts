import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotificationTemplates1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'notification_templates',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: 'org_id', type: 'uuid', isNullable: true },
        { name: 'name', type: 'varchar', length: '200', isNullable: false },
        { name: 'event_type', type: 'varchar', length: '100', isNullable: false },
        { name: 'channel', type: 'varchar', length: '20', isNullable: false },
        { name: 'subject', type: 'varchar', length: '500', isNullable: true },
        { name: 'body_template', type: 'text', isNullable: false },
        { name: 'variables', type: 'jsonb', default: "'[]'" },
        { name: 'is_active', type: 'boolean', default: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      ],
    }), true);
    await queryRunner.createIndex('notification_templates', new TableIndex({ name: 'IDX_TEMPLATE_EVENT_CHANNEL', columnNames: ['event_type', 'channel'] }));
    await queryRunner.createIndex('notification_templates', new TableIndex({ name: 'IDX_TEMPLATE_ORG', columnNames: ['org_id'] }));
  }
  public async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.dropTable('notification_templates'); }
}
