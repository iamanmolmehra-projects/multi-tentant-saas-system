import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInvoiceNumbering1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_numbering',
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
            isUnique: true,
          },
          {
            name: 'prefix',
            type: 'varchar',
            length: '20',
            default: "'INV'",
          },
          {
            name: 'separator',
            type: 'varchar',
            length: '5',
            default: "'-'",
          },
          {
            name: 'current_number',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'format',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'padding',
            type: 'int',
            default: 5,
          },
          {
            name: 'financial_year_reset',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_numbering');
  }
}
