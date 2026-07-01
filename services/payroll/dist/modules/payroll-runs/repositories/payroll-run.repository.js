"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_run_entity_1 = require("../entities/payroll-run.entity");
let PayrollRunRepository = class PayrollRunRepository {
    constructor(repo, dataSource) {
        this.repo = repo;
        this.dataSource = dataSource;
    }
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findById(id, orgId) {
        return this.repo.findOne({
            where: { id, orgId },
            relations: ['cycle', 'payslips'],
        });
    }
    async findByIdempotencyKey(key) {
        return this.repo.findOne({ where: { idempotencyKey: key } });
    }
    async findAllByOrg(orgId) {
        return this.repo.find({
            where: { orgId },
            relations: ['cycle'],
            order: { createdAt: 'DESC' },
        });
    }
    async acquireLock(lockKey, runId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`UPDATE payroll_runs SET lock_key = $1 WHERE id = $2 AND lock_key IS NULL`, [lockKey, runId]);
            await queryRunner.commitTransaction();
            return true;
        }
        catch {
            await queryRunner.rollbackTransaction();
            return false;
        }
        finally {
            await queryRunner.release();
        }
    }
    async releaseLock(runId) {
        await this.repo.update({ id: runId }, { lockKey: null });
    }
    async update(id, orgId, data) {
        const result = await this.repo.update({ id, orgId }, data);
        if (result.affected === 0)
            return null;
        return this.findById(id, orgId);
    }
    async updateStatus(id, status, additionalData) {
        await this.repo.update({ id }, { status, ...additionalData });
    }
};
exports.PayrollRunRepository = PayrollRunRepository;
exports.PayrollRunRepository = PayrollRunRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_run_entity_1.PayrollRunEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], PayrollRunRepository);
//# sourceMappingURL=payroll-run.repository.js.map