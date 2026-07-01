import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateExpensePolicies1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expense_policies',
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
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'max_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'INR'",
          },
          {
            name: 'period',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'requires_receipt_above',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'auto_approve_below',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
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
        foreignKeys: [
          {
            name: 'FK_POLICY_CATEGORY',
            columnNames: ['category_id'],
            referencedTableName: 'expense_categories',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'expense_policies',
      new TableIndex({
        name: 'IDX_POLICY_ORG',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'expense_policies',
      new TableIndex({
        name: 'IDX_POLICY_ORG_CATEGORY',
        columnNames: ['org_id', 'category_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('expense_policies');
  }
}
