import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateInvoiceLineItems1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_line_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'invoice_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
            default: 1,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'tax_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'tax_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'discount_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'line_total',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'hsn_code',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'sort_order',
            type: 'int',
            default: 0,
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
      'invoice_line_items',
      new TableForeignKey({
        name: 'FK_LINE_ITEM_INVOICE',
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_line_items');
  }
}
