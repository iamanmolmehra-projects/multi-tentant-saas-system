import { CategoryEntity } from '../../categories/entities/category.entity';
export declare class PolicyEntity {
    id: string;
    orgId: string;
    name: string;
    categoryId: string | null;
    category: CategoryEntity | null;
    roleId: string | null;
    maxAmount: number | null;
    currency: string;
    period: string | null;
    requiresReceiptAbove: number | null;
    autoApproveBelow: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
