"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseApprovals1700000000005 = void 0;
const typeorm_1 = require("typeorm");
class CreateExpenseApprovals1700000000005 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'expense_approvals',
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
                    name: 'expense_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'report_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'approver_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'level',
                    type: 'int',
                    default: 1,
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
                    name: 'decided_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
            foreignKeys: [
                {
                    name: 'FK_APPROVAL_EXPENSE',
                    columnNames: ['expense_id'],
                    referencedTableName: 'expenses',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
                {
                    name: 'FK_APPROVAL_REPORT',
                    columnNames: ['report_id'],
                    referencedTableName: 'expense_reports',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);
        await queryRunner.createIndex('expense_approvals', new typeorm_1.TableIndex({
            name: 'IDX_APPROVAL_EXPENSE',
            columnNames: ['expense_id'],
        }));
        await queryRunner.createIndex('expense_approvals', new typeorm_1.TableIndex({
            name: 'IDX_APPROVAL_REPORT',
            columnNames: ['report_id'],
        }));
        await queryRunner.createIndex('expense_approvals', new typeorm_1.TableIndex({
            name: 'IDX_APPROVAL_APPROVER',
            columnNames: ['org_id', 'approver_id', 'status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('expense_approvals');
    }
}
exports.CreateExpenseApprovals1700000000005 = CreateExpenseApprovals1700000000005;
//# sourceMappingURL=1700000000005-CreateExpenseApprovals.js.map