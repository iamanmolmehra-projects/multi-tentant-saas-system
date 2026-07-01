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
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoryRepository = class CategoryRepository {
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
            relations: ['children'],
        });
    }
    async findByCode(code, orgId) {
        return this.repo.findOne({
            where: { code, orgId },
        });
    }
    async findAllByOrg(orgId, includeInactive = false) {
        const where = { orgId };
        if (!includeInactive) {
            where.isActive = true;
        }
        return this.repo.find({
            where,
            relations: ['children'],
            order: { name: 'ASC' },
        });
    }
    async update(id, orgId, data) {
        const result = await this.repo.update({ id, orgId }, data);
        if (result.affected === 0) {
            return null;
        }
        return this.findById(id, orgId);
    }
    async softDelete(id, orgId) {
        const result = await this.repo.softDelete({ id, orgId });
        return (result.affected ?? 0) > 0;
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryRepository);
//# sourceMappingURL=category.repository.js.map