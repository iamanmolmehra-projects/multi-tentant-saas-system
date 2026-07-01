import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportExecutions1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_executions',
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
            name: 'report_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'parameters',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'result_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'row_count',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'started_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'triggered_by',
            type: 'varchar',
            length: '20',
            default: "'user'",
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

    await queryRunner.createForeignKey(
      'report_executions',
      new TableForeignKey({
        name: 'FK_EXECUTION_REPORT',
        columnNames: ['report_id'],
        referencedTableName: 'report_definitions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'report_executions',
      new TableIndex({
        name: 'IDX_EXECUTION_ORG_REPORT',
        columnNames: ['org_id', 'report_id'],
      }),
    );

    await queryRunner.createIndex(
      'report_executions',
      new TableIndex({
        name: 'IDX_EXECUTION_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_executions');
  }
}
