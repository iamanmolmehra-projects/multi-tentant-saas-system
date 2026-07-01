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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("./repositories/category.repository");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(orgId, dto) {
        const existing = await this.categoryRepository.findByCode(dto.code, orgId);
        if (existing) {
            throw new common_1.ConflictException(`Category with code '${dto.code}' already exists in this organization`);
        }
        return this.categoryRepository.create({
            orgId,
            name: dto.name,
            code: dto.code,
            description: dto.description || null,
            parentId: dto.parentId || null,
        });
    }
    async findAll(orgId, includeInactive = false) {
        return this.categoryRepository.findAllByOrg(orgId, includeInactive);
    }
    async findById(id, orgId) {
        const category = await this.categoryRepository.findById(id, orgId);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, orgId, dto) {
        if (dto.code) {
            const existing = await this.categoryRepository.findByCode(dto.code, orgId);
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Category with code '${dto.code}' already exists`);
            }
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.code !== undefined)
            updateData.code = dto.code;
        if (dto.description !== undefined)
            updateData.description = dto.description || null;
        if (dto.parentId !== undefined)
            updateData.parentId = dto.parentId || null;
        const updated = await this.categoryRepository.update(id, orgId, updateData);
        if (!updated) {
            throw new common_1.NotFoundException('Category not found');
        }
        return updated;
    }
    async deactivate(id, orgId) {
        const updated = await this.categoryRepository.update(id, orgId, { isActive: false });
        if (!updated) {
            throw new common_1.NotFoundException('Category not found');
        }
    }
    async delete(id, orgId) {
        const success = await this.categoryRepository.softDelete(id, orgId);
        if (!success) {
            throw new common_1.NotFoundException('Category not found');
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map