"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseCategories1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateExpenseCategories1700000000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'expense_categories',
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
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'parent_id',
                    type: 'uuid',
                    isNullable: true,
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
            foreignKeys: [
                {
                    name: 'FK_CAT_PARENT',
                    columnNames: ['parent_id'],
                    referencedTableName: 'expense_categories',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                },
            ],
        }), true);
        await queryRunner.createIndex('expense_categories', new typeorm_1.TableIndex({
            name: 'IDX_CAT_ORG_CODE',
            columnNames: ['org_id', 'code'],
            isUnique: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('expense_categories');
    }
}
exports.CreateExpenseCategories1700000000001 = CreateExpenseCategories1700000000001;
//# sourceMappingURL=1700000000001-CreateExpenseCategories.js.map