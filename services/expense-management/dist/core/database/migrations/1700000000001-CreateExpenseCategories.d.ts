import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateExpenseCategories1700000000001 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
