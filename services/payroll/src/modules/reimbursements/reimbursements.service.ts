import { Injectable, Logger } from '@nestjs/common';
import { PayrollReimbursementEntity } from './entities/payroll-reimbursement.entity';
import { PayrollReimbursementRepository } from './repositories/payroll-reimbursement.repository';

/**
 * Event payload from the expense service when a reimbursement is approved.
 */
export interface ReimbursementApprovedEvent {
  eventId: string;
  orgId: string;
  userId: string;
  expenseReportId: string;
  amount: number;
  currency: string;
}

/**
 * Service to handle reimbursements from the expense management service.
 * Acts as an event consumer - receives approved reimbursement events
 * and queues them for inclusion in the next payroll run.
 */
@Injectable()
export class ReimbursementsService {
  private readonly logger = new Logger(ReimbursementsService.name);

  constructor(
    private readonly reimbursementRepository: PayrollReimbursementRepository,
  ) {}

  /**
   * Handles a reimbursement approved event from the expense service.
   * Idempotent - uses event_id to prevent duplicate processing.
   */
  async handleReimbursementApproved(
    event: ReimbursementApprovedEvent,
  ): Promise<PayrollReimbursementEntity> {
    // Idempotency check using event_id
    const existing = await this.reimbursementRepository.findByEventId(event.eventId);
    if (existing) {
      this.logger.log(`Duplicate event received: ${event.eventId}, skipping`);
      return existing;
    }

    const reimbursement = await this.reimbursementRepository.create({
      orgId: event.orgId,
      userId: event.userId,
      expenseReportId: event.expenseReportId,
      amount: event.amount,
      currency: event.currency || 'INR',
      status: 'pending',
      eventId: event.eventId,
    });

    this.logger.log(
      `Reimbursement queued: ${reimbursement.id} for user ${event.userId} - amount ${event.amount}`,
    );

    return reimbursement;
  }

  /**
   * Gets the total pending reimbursement amount for a user.
   */
  async getPendingTotal(orgId: string, userId: string): Promise<number> {
    return this.reimbursementRepository.sumPendingByUser(orgId, userId);
  }

  /**
   * Marks all pending reimbursements for a user as included in a payroll run.
   */
  async markAsIncluded(orgId: string, userId: string, runId: string): Promise<void> {
    await this.reimbursementRepository.markAsIncluded(orgId, userId, runId);
  }

  /**
   * Gets all reimbursements included in a specific payroll run.
   */
  async findByRunId(runId: string): Promise<PayrollReimbursementEntity[]> {
    return this.reimbursementRepository.findByRunId(runId);
  }
}
