import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollCycleEntity } from './entities/payroll-cycle.entity';
import { PayrollCycleRepository } from './repositories/payroll-cycle.repository';
import { PayrollCyclesService } from './payroll-cycles.service';
import { PayrollCyclesController } from './payroll-cycles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollCycleEntity])],
  controllers: [PayrollCyclesController],
  providers: [PayrollCyclesService, PayrollCycleRepository],
  exports: [PayrollCyclesService, PayrollCycleRepository],
})
export class PayrollCyclesModule {}
