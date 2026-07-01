import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSalaryStructureDto {
  @ApiProperty({ description: 'User ID for the salary structure', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Base salary amount', example: 50000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  baseSalary: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({
    description: 'Salary components breakdown (e.g., HRA, DA, special allowance)',
    example: { hra: 20000, da: 10000, special_allowance: 5000 },
  })
  @IsObject()
  components: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Deductions (e.g., PF, ESI)',
    example: { pf: 1800, esi: 500 },
  })
  @IsOptional()
  @IsObject()
  deductions?: Record<string, number>;

  @ApiProperty({ description: 'Effective from date', example: '2024-01-01' })
  @IsDateString()
  effectiveFrom: string;

  @ApiPropertyOptional({ description: 'Effective to date (null for current)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
