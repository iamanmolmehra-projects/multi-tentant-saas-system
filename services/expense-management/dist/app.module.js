"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_pino_1 = require("nestjs-pino");
const typeorm_2 = require("typeorm");
const typeorm_config_service_1 = require("./core/database/typeorm-config.service");
const jwt_auth_impl_guard_1 = require("./modules/auth/guards/jwt-auth-impl.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const expenses_module_1 = require("./modules/expenses/expenses.module");
const categories_module_1 = require("./modules/categories/categories.module");
const policies_module_1 = require("./modules/policies/policies.module");
const reports_module_1 = require("./modules/reports/reports.module");
const approvals_module_1 = require("./modules/approvals/approvals.module");
const reimbursements_module_1 = require("./modules/reimbursements/reimbursements.module");
const health_module_1 = require("./modules/health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                isGlobal: true,
            }),
            nestjs_pino_1.LoggerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    pinoHttp: {
                        level: configService.get('NODE_ENV') === 'production' ? 'info' : 'debug',
                        transport: configService.get('NODE_ENV') !== 'production'
                            ? { target: 'pino-pretty', options: { singleLine: true } }
                            : undefined,
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: typeorm_config_service_1.TypeOrmConfigService,
                dataSourceFactory: async (options) => new typeorm_2.DataSource(options).initialize(),
            }),
            auth_module_1.AuthModule,
            expenses_module_1.ExpensesModule,
            categories_module_1.CategoriesModule,
            policies_module_1.PoliciesModule,
            reports_module_1.ReportsModule,
            approvals_module_1.ApprovalsModule,
            reimbursements_module_1.ReimbursementsModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_impl_guard_1.JwtAuthGuardImpl,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map