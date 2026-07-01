"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayslips1700000000004 = void 0;
const typeorm_1 = require("typeorm");
class CreatePayslips1700000000004 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'payslips',
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
                    isNullable: false,
                },
                {
                    name: 'run_id',
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
                    name: 'gross_salary',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'net_salary',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'components',
                    type: 'jsonb',
                    isNullable: false,
                },
                {
                    name: 'deductions',
                    type: 'jsonb',
                    isNullable: false,
                },
                {
                    name: 'reimbursements',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'ytd_gross',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'ytd_tax',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'pdf_url',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('payslips', new typeorm_1.TableForeignKey({
            name: 'FK_PAYSLIP_RUN',
            columnNames: ['run_id'],
            referencedTableName: 'payroll_runs',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('payslips', new typeorm_1.TableIndex({
            name: 'IDX_PAYSLIP_ORG_USER_PERIOD',
            columnNames: ['org_id', 'user_id', 'period_start', 'period_end'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('payslips');
    }
}
exports.CreatePayslips1700000000004 = CreatePayslips1700000000004;
//# sourceMappingURL=1700000000004-CreatePayslips.js.map