import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePayrollCycleDto {
  @ApiProperty({ description: 'Payroll cycle name', example: 'Monthly Payroll' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Payment frequency',
    example: 'monthly',
    enum: ['weekly', 'biweekly', 'monthly'],
  })
  @IsString()
  @IsIn(['weekly', 'biweekly', 'monthly'])
  frequency: string;

  @ApiProperty({ description: 'Day of the month for payment (1-31)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(31)
  payDay: number;

  @ApiProperty({ description: 'Cycle start date', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ description: 'Cycle end date', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
