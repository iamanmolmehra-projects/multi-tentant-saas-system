import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWorkflowInstances1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workflow_instances',
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
            name: 'template_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'template_version',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'trigger_entity_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'trigger_entity_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'initiated_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'active'",
          },
          {
            name: 'current_step',
            type: 'int',
            default: 1,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            default: "'{}'",
          },
          {
            name: 'started_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
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
      'workflow_instances',
      new TableForeignKey({
        name: 'FK_INSTANCE_TEMPLATE',
        columnNames: ['template_id'],
        referencedTableName: 'workflow_templates',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'workflow_instances',
      new TableIndex({
        name: 'IDX_INSTANCE_ORG',
        columnNames: ['org_id'],
      }),
    );

    await queryRunner.createIndex(
      'workflow_instances',
      new TableIndex({
        name: 'IDX_INSTANCE_TRIGGER',
        columnNames: ['trigger_entity_type', 'trigger_entity_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'workflow_instances',
      new TableIndex({
        name: 'IDX_INSTANCE_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workflow_instances');
  }
}
