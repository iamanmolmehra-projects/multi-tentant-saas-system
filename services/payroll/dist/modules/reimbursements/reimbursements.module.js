"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payroll_reimbursement_entity_1 = require("./entities/payroll-reimbursement.entity");
const payroll_reimbursement_repository_1 = require("./repositories/payroll-reimbursement.repository");
const reimbursements_service_1 = require("./reimbursements.service");
let ReimbursementsModule = class ReimbursementsModule {
};
exports.ReimbursementsModule = ReimbursementsModule;
exports.ReimbursementsModule = ReimbursementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payroll_reimbursement_entity_1.PayrollReimbursementEntity])],
        providers: [reimbursements_service_1.ReimbursementsService, payroll_reimbursement_repository_1.PayrollReimbursementRepository],
        exports: [reimbursements_service_1.ReimbursementsService, payroll_reimbursement_repository_1.PayrollReimbursementRepository],
    })
], ReimbursementsModule);
//# sourceMappingURL=reimbursements.module.js.map