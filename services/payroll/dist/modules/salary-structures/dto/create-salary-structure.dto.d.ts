export declare class CreateSalaryStructureDto {
    userId: string;
    baseSalary: number;
    currency?: string;
    components: Record<string, number>;
    deductions?: Record<string, number>;
    effectiveFrom: string;
    effectiveTo?: string;
}
