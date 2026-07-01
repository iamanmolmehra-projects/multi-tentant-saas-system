import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardWidgetEntity } from './entities/dashboard-widget.entity';
import { FactExpenseEntity } from '../data-ingestion/entities/fact-expense.entity';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(DashboardWidgetEntity) private readonly widgetRepo: Repository<DashboardWidgetEntity>,
    @InjectRepository(FactExpenseEntity) private readonly factExpenseRepo: Repository<FactExpenseEntity>,
  ) {}

  async findWidgets(orgId: string, userId: string): Promise<DashboardWidgetEntity[]> {
    return this.widgetRepo.find({
      where: [{ orgId, userId }, { orgId, userId: null as unknown as undefined }], // org-level + user-specific
      order: { createdAt: 'ASC' },
    });
  }

  async createWidget(orgId: string, userId: string, data: Partial<DashboardWidgetEntity>): Promise<DashboardWidgetEntity> {
    return this.widgetRepo.save(this.widgetRepo.create({ ...data, orgId, userId }));
  }

  async updateWidget(id: string, orgId: string, data: Partial<DashboardWidgetEntity>): Promise<DashboardWidgetEntity> {
    const widget = await this.widgetRepo.findOne({ where: { id, orgId } });
    if (!widget) throw new NotFoundException('Widget not found');
    Object.assign(widget, data);
    return this.widgetRepo.save(widget);
  }

  async deleteWidget(id: string, orgId: string): Promise<void> {
    await this.widgetRepo.delete({ id, orgId });
  }

  /**
   * Get aggregated data for a widget based on its data_source and config.
   * All queries are scoped to orgId for tenant isolation.
   */
  async getWidgetData(orgId: string, widgetId: string): Promise<unknown> {
    const widget = await this.widgetRepo.findOne({ where: { id: widgetId, orgId } });
    if (!widget) throw new NotFoundException('Widget not found');

    // Example: expense summary by category
    if (widget.dataSource === 'expense') {
      return this.factExpenseRepo
        .createQueryBuilder('e')
        .select('e.category_name', 'category')
        .addSelect('SUM(e.amount)', 'total')
        .addSelect('COUNT(*)', 'count')
        .where('e.org_id = :orgId', { orgId })
        .groupBy('e.category_name')
        .getRawMany();
    }

    return { message: 'Widget data not implemented for this data_source' };
  }
}
