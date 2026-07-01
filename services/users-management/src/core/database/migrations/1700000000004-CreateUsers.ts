import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUsers1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'org_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'parent_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Reporting manager / hierarchy parent within org',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
            comment: 'Optimistic locking version for concurrency control',
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
      'users',
      new TableForeignKey({
        name: 'FK_USER_ORG',
        columnNames: ['org_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'FK_USER_ROLE',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'FK_USER_PARENT',
        columnNames: ['parent_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Unique email per org (same person can exist in multiple orgs)
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_ORG_EMAIL',
        columnNames: ['org_id', 'email'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_ORG_ID',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_PARENT_ID',
        columnNames: ['parent_id'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_ROLE_ID',
        columnNames: ['role_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
