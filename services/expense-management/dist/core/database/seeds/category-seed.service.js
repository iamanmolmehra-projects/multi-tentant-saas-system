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
exports.CategorySeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../../../modules/categories/entities/category.entity");
const DEFAULT_CATEGORIES = [
    {
        name: 'Travel',
        code: 'TRAVEL',
        description: 'Travel-related expenses including flights, hotels, and car rentals',
    },
    {
        name: 'Meals',
        code: 'MEALS',
        description: 'Meals and dining expenses during business activities',
    },
    {
        name: 'Office Supplies',
        code: 'OFFICE_SUPPLIES',
        description: 'Office supplies, stationery, and equipment',
    },
    {
        name: 'Transportation',
        code: 'TRANSPORTATION',
        description: 'Local transportation including cab, metro, and fuel',
    },
    {
        name: 'Communication',
        code: 'COMMUNICATION',
        description: 'Phone, internet, and communication expenses',
    },
    {
        name: 'Miscellaneous',
        code: 'MISCELLANEOUS',
        description: 'Other uncategorized business expenses',
    },
];
let CategorySeedService = class CategorySeedService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async run() {
        const existingOrgs = await this.categoryRepo
            .createQueryBuilder('cat')
            .select('DISTINCT cat.org_id', 'orgId')
            .getRawMany();
        const orgs = await this.categoryRepo.manager.query(`SELECT id FROM organizations WHERE is_active = true`).catch(() => []);
        const orgIds = new Set([
            ...existingOrgs.map((o) => o.orgId),
            ...orgs.map((o) => o.id),
        ]);
        for (const orgId of orgIds) {
            await this.seedForOrg(orgId);
        }
    }
    async seedForOrg(orgId) {
        for (const category of DEFAULT_CATEGORIES) {
            const existing = await this.categoryRepo.findOne({
                where: { orgId, code: category.code },
            });
            if (!existing) {
                await this.categoryRepo.save(this.categoryRepo.create({
                    orgId,
                    name: category.name,
                    code: category.code,
                    description: category.description,
                    isActive: true,
                }));
            }
        }
    }
};
exports.CategorySeedService = CategorySeedService;
exports.CategorySeedService = CategorySeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategorySeedService);
//# sourceMappingURL=category-seed.service.js.map