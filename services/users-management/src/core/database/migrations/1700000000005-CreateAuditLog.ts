import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAuditLog1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'org_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'entity_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'entity_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'changes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
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
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_ORG_ID',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_ENTITY',
        columnNames: ['entity_type', 'entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs');
  }
}
