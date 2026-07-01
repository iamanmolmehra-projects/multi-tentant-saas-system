import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDashboardWidgets1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dashboard_widgets',
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
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'data_source',
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
            name: 'position',
            type: 'jsonb',
            default: "'{}'",
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
      'dashboard_widgets',
      new TableIndex({
        name: 'IDX_WIDGET_ORG_USER',
        columnNames: ['org_id', 'user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dashboard_widgets');
  }
}
