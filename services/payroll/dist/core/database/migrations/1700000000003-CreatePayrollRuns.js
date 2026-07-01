"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayrollRuns1700000000003 = void 0;
const typeorm_1 = require("typeorm");
class CreatePayrollRuns1700000000003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'payroll_runs',
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
                    name: 'cycle_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'period_start',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'period_end',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'pending'",
                },
                {
                    name: 'total_gross',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'total_net',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'total_tax',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'employee_count',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'processed_by',
                    type: 'uuid',
                    isNullable: true,
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
                    name: 'error_details',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'lock_key',
                    type: 'varchar',
                    length: '64',
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: 'idempotency_key',
                    type: 'varchar',
                    length: '64',
                    isNullable: true,
                    isUnique: true,
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
        }), true);
        await queryRunner.createForeignKey('payroll_runs', new typeorm_1.TableForeignKey({
            name: 'FK_RUN_CYCLE',
            columnNames: ['cycle_id'],
            referencedTableName: 'payroll_cycles',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
        }));
        await queryRunner.createIndex('payroll_runs', new typeorm_1.TableIndex({
            name: 'IDX_RUN_ORG_CYCLE',
            columnNames: ['org_id', 'cycle_id'],
        }));
        await queryRunner.createIndex('payroll_runs', new typeorm_1.TableIndex({
            name: 'IDX_RUN_STATUS',
            columnNames: ['status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('payroll_runs');
    }
}
exports.CreatePayrollRuns1700000000003 = CreatePayrollRuns1700000000003;
//# sourceMappingURL=1700000000003-CreatePayrollRuns.js.map