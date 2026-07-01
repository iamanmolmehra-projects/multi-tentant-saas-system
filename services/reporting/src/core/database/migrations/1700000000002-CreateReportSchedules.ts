import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportSchedules1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_schedules',
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
            name: 'frequency',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'day_of_week',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'day_of_month',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'time_of_day',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'recipients',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'export_format',
            type: 'varchar',
            length: '10',
            default: "'pdf'",
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_run_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'next_run_at',
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

    await queryRunner.createForeignKey(
      'report_schedules',
      new TableForeignKey({
        name: 'FK_SCHEDULE_REPORT',
        columnNames: ['report_id'],
        referencedTableName: 'report_definitions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'report_schedules',
      new TableIndex({
        name: 'IDX_SCHEDULE_NEXT_RUN',
        columnNames: ['next_run_at'],
      }),
    );

    await queryRunner.createIndex(
      'report_schedules',
      new TableIndex({
        name: 'IDX_SCHEDULE_ORG',
        columnNames: ['org_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_schedules');
  }
}
