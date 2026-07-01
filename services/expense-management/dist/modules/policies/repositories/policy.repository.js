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
exports.PolicyRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("../entities/policy.entity");
let PolicyRepository = class PolicyRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findById(id, orgId) {
        return this.repo.findOne({
            where: { id, orgId },
            relations: ['category'],
        });
    }
    async findAllByOrg(orgId, activeOnly = true) {
        const where = { orgId };
        if (activeOnly) {
            where.isActive = true;
        }
        return this.repo.find({
            where,
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }
    async findApplicablePolicies(orgId, categoryId, roleId) {
        const qb = this.repo
            .createQueryBuilder('policy')
            .where('policy.org_id = :orgId', { orgId })
            .andWhere('policy.is_active = true');
        if (categoryId) {
            qb.andWhere('(policy.category_id = :categoryId OR policy.category_id IS NULL)', {
                categoryId,
            });
        }
        else {
            qb.andWhere('policy.category_id IS NULL');
        }
        if (roleId) {
            qb.andWhere('(policy.role_id = :roleId OR policy.role_id IS NULL)', { roleId });
        }
        else {
            qb.andWhere('policy.role_id IS NULL');
        }
        return qb.getMany();
    }
    async update(id, orgId, data) {
        const result = await this.repo.update({ id, orgId }, data);
        if (result.affected === 0) {
            return null;
        }
        return this.findById(id, orgId);
    }
    async delete(id, orgId) {
        const result = await this.repo.delete({ id, orgId });
        return (result.affected ?? 0) > 0;
    }
};
exports.PolicyRepository = PolicyRepository;
exports.PolicyRepository = PolicyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.PolicyEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PolicyRepository);
//# sourceMappingURL=policy.repository.js.map