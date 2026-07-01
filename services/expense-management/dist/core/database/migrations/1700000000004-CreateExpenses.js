"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenses1700000000004 = void 0;
const typeorm_1 = require("typeorm");
class CreateExpenses1700000000004 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'expenses',
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
                    name: 'report_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'category_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
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
                    name: 'expense_date',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'merchant_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'receipt_url',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'receipt_metadata',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'draft'",
                },
                {
                    name: 'policy_violation',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
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
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
            foreignKeys: [
                {
                    name: 'FK_EXPENSE_REPORT',
                    columnNames: ['report_id'],
                    referencedTableName: 'expense_reports',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                },
                {
                    name: 'FK_EXPENSE_CATEGORY',
                    columnNames: ['category_id'],
                    referencedTableName: 'expense_categories',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                },
            ],
        }), true);
        await queryRunner.createIndex('expenses', new typeorm_1.TableIndex({
            name: 'IDX_EXPENSE_ORG_USER',
            columnNames: ['org_id', 'user_id'],
        }));
        await queryRunner.createIndex('expenses', new typeorm_1.TableIndex({
            name: 'IDX_EXPENSE_REPORT',
            columnNames: ['report_id'],
        }));
        await queryRunner.createIndex('expenses', new typeorm_1.TableIndex({
            name: 'IDX_EXPENSE_IDEMPOTENCY',
            columnNames: ['idempotency_key'],
            isUnique: true,
        }));
        await queryRunner.createIndex('expenses', new typeorm_1.TableIndex({
            name: 'IDX_EXPENSE_STATUS',
            columnNames: ['org_id', 'status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('expenses');
    }
}
exports.CreateExpenses1700000000004 = CreateExpenses1700000000004;
//# sourceMappingURL=1700000000004-CreateExpenses.js.map