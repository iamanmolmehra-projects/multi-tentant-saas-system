import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';

export interface AuditLogInput {
  orgId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
  ) {}

  async log(input: AuditLogInput): Promise<void> {
    const entity = this.auditRepo.create({
      orgId: input.orgId,
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      changes: input.changes as Record<string, unknown>,
      ipAddress: input.ipAddress || null,
      userAgent: input.userAgent || null,
    });

    // Fire-and-forget, don't block the main operation
    await this.auditRepo.save(entity).catch(() => {
      // Silent fail for audit logs - shouldn't break business operations
    });
  }

  async findByEntity(
    orgId: string,
    entityType: string,
    entityId: string,
  ): Promise<AuditLogEntity[]> {
    return this.auditRepo.find({
      where: { orgId, entityType, entityId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
