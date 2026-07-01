"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSalaryStructures1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateSalaryStructures1700000000001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'salary_structures',
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
                    name: 'base_salary',
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
                    name: 'components',
                    type: 'jsonb',
                    isNullable: false,
                },
                {
                    name: 'deductions',
                    type: 'jsonb',
                    default: "'{}'",
                },
                {
                    name: 'effective_from',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'effective_to',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'is_current',
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
            ],
        }), true);
        await queryRunner.createIndex('salary_structures', new typeorm_1.TableIndex({
            name: 'IDX_SALARY_ORG_USER',
            columnNames: ['org_id', 'user_id'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('salary_structures');
    }
}
exports.CreateSalaryStructures1700000000001 = CreateSalaryStructures1700000000001;
//# sourceMappingURL=1700000000001-CreateSalaryStructures.js.map