"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayrollReimbursements1700000000005 = void 0;
const typeorm_1 = require("typeorm");
class CreatePayrollReimbursements1700000000005 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'payroll_reimbursements',
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
                    name: 'expense_report_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'currency',
                    type: 'varchar',
                    length: '3',
                    default: "'INR'",
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'pending'",
                },
                {
                    name: 'included_in_run_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'event_id',
                    type: 'varchar',
                    length: '64',
                    isNullable: false,
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
        await queryRunner.createForeignKey('payroll_reimbursements', new typeorm_1.TableForeignKey({
            name: 'FK_REIMB_RUN',
            columnNames: ['included_in_run_id'],
            referencedTableName: 'payroll_runs',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('payroll_reimbursements', new typeorm_1.TableIndex({
            name: 'IDX_REIMB_ORG_USER',
            columnNames: ['org_id', 'user_id'],
        }));
        await queryRunner.createIndex('payroll_reimbursements', new typeorm_1.TableIndex({
            name: 'IDX_REIMB_STATUS',
            columnNames: ['status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('payroll_reimbursements');
    }
}
exports.CreatePayrollReimbursements1700000000005 = CreatePayrollReimbursements1700000000005;
//# sourceMappingURL=1700000000005-CreatePayrollReimbursements.js.map