"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_config_service_1 = require("../typeorm-config.service");
const category_entity_1 = require("../../../modules/categories/entities/category.entity");
const category_seed_service_1 = require("./category-seed.service");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: typeorm_config_service_1.TypeOrmConfigService,
                dataSourceFactory: async (options) => new typeorm_2.DataSource(options).initialize(),
            }),
            typeorm_1.TypeOrmModule.forFeature([category_entity_1.CategoryEntity]),
        ],
        providers: [category_seed_service_1.CategorySeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map