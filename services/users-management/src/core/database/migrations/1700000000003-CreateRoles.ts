import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRoles1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'org_id',
            type: 'uuid',
            isNullable: true,
            comment: 'NULL for system-level roles, set for org-specific roles',
          },
          {
            name: 'is_system',
            type: 'boolean',
            default: false,
            comment: 'System roles cannot be modified by orgs',
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

    await queryRunner.createForeignKey(
      'roles',
      new TableForeignKey({
        name: 'FK_ROLE_ORG',
        columnNames: ['org_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'roles',
      new TableIndex({
        name: 'IDX_ROLE_ORG_NAME',
        columnNames: ['org_id', 'name'],
        isUnique: true,
      }),
    );

    // Role-permission junction table
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          {
            name: 'role_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'permission_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_RP_ROLE',
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_RP_PERMISSION',
            columnNames: ['permission_id'],
            referencedTableName: 'permissions',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions');
    await queryRunner.dropTable('roles');
  }
}
