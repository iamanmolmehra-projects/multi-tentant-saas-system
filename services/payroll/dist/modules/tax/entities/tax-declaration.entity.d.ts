export declare class TaxDeclarationEntity {
    id: string;
    orgId: string;
    userId: string;
    financialYear: string;
    regime: string;
    declarations: Record<string, unknown>;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
