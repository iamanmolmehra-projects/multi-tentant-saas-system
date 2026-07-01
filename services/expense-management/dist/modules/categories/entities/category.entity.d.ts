export declare class CategoryEntity {
    id: string;
    orgId: string;
    name: string;
    code: string;
    description: string | null;
    parentId: string | null;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
