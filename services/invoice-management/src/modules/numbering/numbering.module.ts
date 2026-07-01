import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceNumberingEntity } from './entities/invoice-numbering.entity';
import { NumberingService } from './numbering.service';
import { NumberingRepository } from './repositories/numbering.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceNumberingEntity])],
  providers: [NumberingService, NumberingRepository],
  exports: [NumberingService],
})
export class NumberingModule {}
