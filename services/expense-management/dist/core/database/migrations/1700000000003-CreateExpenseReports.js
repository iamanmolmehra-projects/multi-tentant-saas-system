"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseReports1700000000003 = void 0;
const typeorm_1 = require("typeorm");
class CreateExpenseReports1700000000003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'expense_reports',
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
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'draft'",
                },
                {
                    name: 'total_amount',
                    type: 'decimal',
                    precision: 15,
                    scale: 2,
                    default: 0,
                },
                {
                    name: 'currency',
                    type: 'varchar',
                    length: '3',
                    default: "'INR'",
                },
                {
                    name: 'submitted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'approved_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'approved_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'version',
                    type: 'int',
                    default: 1,
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
        }), true);
        await queryRunner.createIndex('expense_reports', new typeorm_1.TableIndex({
            name: 'IDX_REPORT_ORG_USER',
            columnNames: ['org_id', 'user_id'],
        }));
        await queryRunner.createIndex('expense_reports', new typeorm_1.TableIndex({
            name: 'IDX_REPORT_STATUS',
            columnNames: ['org_id', 'status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('expense_reports');
    }
}
exports.CreateExpenseReports1700000000003 = CreateExpenseReports1700000000003;
//# sourceMappingURL=1700000000003-CreateExpenseReports.js.map