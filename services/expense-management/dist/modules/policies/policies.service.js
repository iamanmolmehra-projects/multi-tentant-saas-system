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
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const policy_repository_1 = require("./repositories/policy.repository");
let PoliciesService = class PoliciesService {
    constructor(policyRepository) {
        this.policyRepository = policyRepository;
    }
    async create(orgId, data) {
        return this.policyRepository.create({ ...data, orgId });
    }
    async findAll(orgId) {
        return this.policyRepository.findAllByOrg(orgId);
    }
    async findById(id, orgId) {
        const policy = await this.policyRepository.findById(id, orgId);
        if (!policy) {
            throw new common_1.NotFoundException('Policy not found');
        }
        return policy;
    }
    async update(id, orgId, data) {
        const updated = await this.policyRepository.update(id, orgId, data);
        if (!updated) {
            throw new common_1.NotFoundException('Policy not found');
        }
        return updated;
    }
    async delete(id, orgId) {
        const success = await this.policyRepository.delete(id, orgId);
        if (!success) {
            throw new common_1.NotFoundException('Policy not found');
        }
    }
    async validateExpense(orgId, input) {
        const policies = await this.policyRepository.findApplicablePolicies(orgId, input.categoryId, input.roleId);
        const violations = [];
        for (const policy of policies) {
            const violation = this.applyPolicy(policy, input);
            if (violation) {
                violations.push(violation);
            }
        }
        return violations.length > 0 ? violations.join('; ') : null;
    }
    async canAutoApprove(orgId, amount, categoryId, roleId) {
        const policies = await this.policyRepository.findApplicablePolicies(orgId, categoryId, roleId);
        for (const policy of policies) {
            if (policy.autoApproveBelow !== null && amount < Number(policy.autoApproveBelow)) {
                return true;
            }
        }
        return false;
    }
    applyPolicy(policy, input) {
        if (policy.maxAmount !== null && input.amount > Number(policy.maxAmount)) {
            return `Exceeds max amount of ${policy.currency} ${policy.maxAmount} (Policy: ${policy.name})`;
        }
        if (policy.requiresReceiptAbove !== null &&
            input.amount > Number(policy.requiresReceiptAbove) &&
            !input.receiptUrl) {
            return `Receipt required for expenses above ${policy.currency} ${policy.requiresReceiptAbove} (Policy: ${policy.name})`;
        }
        return null;
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [policy_repository_1.PolicyRepository])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map