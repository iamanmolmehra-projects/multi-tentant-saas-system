import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWorkflowSteps1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workflow_steps',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'instance_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'step_number',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'approver_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'approver_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'approver_role',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'comments',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'sla_hours',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'escalate_to',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'decided_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'due_at',
            type: 'timestamp',
            isNullable: true,
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
      'workflow_steps',
      new TableForeignKey({
        name: 'FK_STEP_INSTANCE',
        columnNames: ['instance_id'],
        referencedTableName: 'workflow_instances',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'workflow_steps',
      new TableIndex({
        name: 'IDX_STEP_INSTANCE',
        columnNames: ['instance_id'],
      }),
    );

    await queryRunner.createIndex(
      'workflow_steps',
      new TableIndex({
        name: 'IDX_STEP_APPROVER',
        columnNames: ['approver_id'],
      }),
    );

    await queryRunner.createIndex(
      'workflow_steps',
      new TableIndex({
        name: 'IDX_STEP_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'workflow_steps',
      new TableIndex({
        name: 'IDX_STEP_DUE',
        columnNames: ['due_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workflow_steps');
  }
}
