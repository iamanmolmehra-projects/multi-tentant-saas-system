import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateEscalationRules1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'escalation_rules',
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
            name: 'step_number',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'hours_before_escalation',
            type: 'int',
            default: 48,
          },
          {
            name: 'escalate_to_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'escalate_to_value',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'notify_on_escalation',
            type: 'boolean',
            default: true,
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
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'escalation_rules',
      new TableForeignKey({
        name: 'FK_ESCALATION_TEMPLATE',
        columnNames: ['template_id'],
        referencedTableName: 'workflow_templates',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'escalation_rules',
      new TableIndex({
        name: 'IDX_ESCALATION_ORG_TEMPLATE',
        columnNames: ['org_id', 'template_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('escalation_rules');
  }
}
