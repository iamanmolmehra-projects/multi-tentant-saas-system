import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayslipEntity } from './entities/payslip.entity';
import { PayslipRepository } from './repositories/payslip.repository';
import { PayslipsService } from './payslips.service';
import { PayslipsController } from './payslips.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PayslipEntity])],
  controllers: [PayslipsController],
  providers: [PayslipsService, PayslipRepository],
  exports: [PayslipsService, PayslipRepository],
})
export class PayslipsModule {}
