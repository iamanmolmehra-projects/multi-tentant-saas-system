import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSalaryStructures1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'salary_structures',
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
            name: 'base_salary',
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
            name: 'components',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'deductions',
            type: 'jsonb',
            default: "'{}'",
          },
          {
            name: 'effective_from',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'effective_to',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_current',
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
      'salary_structures',
      new TableIndex({
        name: 'IDX_SALARY_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('salary_structures');
  }
}
