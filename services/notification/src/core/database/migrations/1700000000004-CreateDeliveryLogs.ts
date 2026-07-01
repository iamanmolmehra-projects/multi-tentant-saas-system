import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDeliveryLogs1700000000004 implements MigrationInterface {
  name = 'CreateDeliveryLogs1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'delivery_logs',
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
            name: 'channel',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'event_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'provider',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'provider_message_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'retry_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'event_id',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'delivered_at',
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
      'delivery_logs',
      new TableIndex({
        name: 'IDX_DELIVERY_USER',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'delivery_logs',
      new TableIndex({
        name: 'IDX_DELIVERY_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'delivery_logs',
      new TableIndex({
        name: 'IDX_DELIVERY_EVENT',
        columnNames: ['event_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('delivery_logs', 'IDX_DELIVERY_EVENT');
    await queryRunner.dropIndex('delivery_logs', 'IDX_DELIVERY_STATUS');
    await queryRunner.dropIndex('delivery_logs', 'IDX_DELIVERY_USER');
    await queryRunner.dropTable('delivery_logs');
  }
}
