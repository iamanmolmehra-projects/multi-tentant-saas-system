import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateReportDefinitions1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_definitions',
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
            name: 'name',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'config',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'visibility',
            type: 'varchar',
            length: '20',
            default: "'private'",
          },
          {
            name: 'allowed_roles',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'is_active',
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
      'report_definitions',
      new TableIndex({
        name: 'IDX_REPORT_DEF_ORG',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'report_definitions',
      new TableIndex({
        name: 'IDX_REPORT_DEF_TYPE',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_definitions');
  }
}
