import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOrganizations1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'parent_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'settings',
            type: 'jsonb',
            isNullable: true,
            default: "'{}'",
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
            name: 'FK_ORG_PARENT',
            columnNames: ['parent_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORG_SLUG',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORG_PARENT_ID',
        columnNames: ['parent_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organizations');
  }
}
