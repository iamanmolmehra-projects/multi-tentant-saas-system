import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseRepository } from './repositories/expense.repository';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity]),
    PoliciesModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpenseRepository],
  exports: [ExpensesService, ExpenseRepository],
})
export class ExpensesModule {}
