import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class TriggerPayrollRunDto {
  @ApiProperty({ description: 'Payroll cycle ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ description: 'Period start date', example: '2024-01-01' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ description: 'Period end date', example: '2024-01-31' })
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional({
    description: 'Idempotency key for deduplication',
    example: 'run-2024-01-org123',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  idempotencyKey?: string;
}
