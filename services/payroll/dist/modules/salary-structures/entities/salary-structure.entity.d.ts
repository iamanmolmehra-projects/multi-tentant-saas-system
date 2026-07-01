export declare class SalaryStructureEntity {
    id: string;
    orgId: string;
    userId: string;
    baseSalary: number;
    currency: string;
    components: Record<string, number>;
    deductions: Record<string, number>;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
