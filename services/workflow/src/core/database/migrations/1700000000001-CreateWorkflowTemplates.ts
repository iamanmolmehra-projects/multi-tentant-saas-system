import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateWorkflowTemplates1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workflow_templates',
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
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'trigger_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
          {
            name: 'steps_config',
            type: 'jsonb',
            isNullable: false,
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
      'workflow_templates',
      new TableIndex({
        name: 'IDX_TEMPLATE_ORG_TRIGGER',
        columnNames: ['org_id', 'trigger_type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workflow_templates');
  }
}
