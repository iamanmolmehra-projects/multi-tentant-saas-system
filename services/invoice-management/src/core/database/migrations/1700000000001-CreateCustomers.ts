import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCustomers1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
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
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'billing_address',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'shipping_address',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tax_id',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'INR'",
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_CUSTOMER_ORG',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'IDX_CUSTOMER_ORG_EMAIL',
        columnNames: ['org_id', 'email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers');
  }
}
