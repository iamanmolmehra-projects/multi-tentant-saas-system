"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaxDeclarations1700000000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateTaxDeclarations1700000000006 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tax_declarations',
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
                    name: 'financial_year',
                    type: 'varchar',
                    length: '10',
                    isNullable: false,
                },
                {
                    name: 'regime',
                    type: 'varchar',
                    length: '20',
                    default: "'new'",
                },
                {
                    name: 'declarations',
                    type: 'jsonb',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '20',
                    default: "'draft'",
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
        await queryRunner.createIndex('tax_declarations', new typeorm_1.TableIndex({
            name: 'IDX_TAX_DECL_ORG_USER_FY',
            columnNames: ['org_id', 'user_id', 'financial_year'],
            isUnique: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('tax_declarations');
    }
}
exports.CreateTaxDeclarations1700000000006 = CreateTaxDeclarations1700000000006;
//# sourceMappingURL=1700000000006-CreateTaxDeclarations.js.map