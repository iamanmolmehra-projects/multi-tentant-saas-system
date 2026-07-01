import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxDeclarationEntity } from './entities/tax-declaration.entity';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { IndiaNewRegimeStrategy } from './strategies/india-new-regime.strategy';
import { IndiaOldRegimeStrategy } from './strategies/india-old-regime.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([TaxDeclarationEntity])],
  controllers: [TaxController],
  providers: [
    TaxService,
    IndiaNewRegimeStrategy,
    IndiaOldRegimeStrategy,
  ],
  exports: [TaxService],
})
export class TaxModule {}
