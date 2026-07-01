import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryStructureEntity } from './entities/salary-structure.entity';
import { SalaryStructureRepository } from './repositories/salary-structure.repository';
import { SalaryStructuresService } from './salary-structures.service';
import { SalaryStructuresController } from './salary-structures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryStructureEntity])],
  controllers: [SalaryStructuresController],
  providers: [SalaryStructuresService, SalaryStructureRepository],
  exports: [SalaryStructuresService, SalaryStructureRepository],
})
export class SalaryStructuresModule {}
