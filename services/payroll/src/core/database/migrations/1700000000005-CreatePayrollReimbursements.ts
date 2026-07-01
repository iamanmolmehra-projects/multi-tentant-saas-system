import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePayrollReimbursements1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payroll_reimbursements',
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
            isNullable: false,
          },
          {
            name: 'expense_report_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'INR'",
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'pending'",
          },
          {
            name: 'included_in_run_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'event_id',
            type: 'varchar',
            length: '64',
            isNullable: false,
            isUnique: true,
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

    await queryRunner.createForeignKey(
      'payroll_reimbursements',
      new TableForeignKey({
        name: 'FK_REIMB_RUN',
        columnNames: ['included_in_run_id'],
        referencedTableName: 'payroll_runs',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'payroll_reimbursements',
      new TableIndex({
        name: 'IDX_REIMB_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );

    await queryRunner.createIndex(
      'payroll_reimbursements',
      new TableIndex({
        name: 'IDX_REIMB_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payroll_reimbursements');
  }
}
