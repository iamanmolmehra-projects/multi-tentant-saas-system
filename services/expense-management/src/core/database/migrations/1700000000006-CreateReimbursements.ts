import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateReimbursements1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reimbursements',
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
            name: 'user_id',
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
            name: 'payroll_ref',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            isNullable: true,
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
        foreignKeys: [
          {
            name: 'FK_REIMBURSEMENT_REPORT',
            columnNames: ['report_id'],
            referencedTableName: 'expense_reports',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'reimbursements',
      new TableIndex({
        name: 'IDX_REIMBURSEMENT_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );

    await queryRunner.createIndex(
      'reimbursements',
      new TableIndex({
        name: 'IDX_REIMBURSEMENT_REPORT',
        columnNames: ['report_id'],
      }),
    );

    await queryRunner.createIndex(
      'reimbursements',
      new TableIndex({
        name: 'IDX_REIMBURSEMENT_STATUS',
        columnNames: ['org_id', 'status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reimbursements');
  }
}
