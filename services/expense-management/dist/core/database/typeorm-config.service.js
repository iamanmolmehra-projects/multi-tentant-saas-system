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
exports.TypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TypeOrmConfigService = class TypeOrmConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: this.configService.get('DATABASE_TYPE', 'postgres'),
            host: this.configService.get('DATABASE_HOST', 'localhost'),
            port: this.configService.get('DATABASE_PORT', 5432),
            username: this.configService.get('DATABASE_USERNAME', 'postgres'),
            password: this.configService.get('DATABASE_PASSWORD', 'postgres'),
            database: this.configService.get('DATABASE_NAME', 'multi_tenant_expenses'),
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
            synchronize: false,
            logging: this.configService.get('NODE_ENV') !== 'production',
            extra: {
                max: this.configService.get('DATABASE_MAX_CONNECTIONS', 100),
            },
        };
    }
};
exports.TypeOrmConfigService = TypeOrmConfigService;
exports.TypeOrmConfigService = TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfigService);
//# sourceMappingURL=typeorm-config.service.js.map