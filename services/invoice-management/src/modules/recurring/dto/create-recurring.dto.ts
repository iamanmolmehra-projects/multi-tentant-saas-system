import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRecurringDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'Invoice frequency',
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'semi_annually', 'annually'],
  })
  @IsString()
  @IsIn(['weekly', 'biweekly', 'monthly', 'quarterly', 'semi_annually', 'annually'])
  frequency: string;

  @ApiPropertyOptional({ description: 'Next issue date' })
  @IsOptional()
  @IsDateString()
  nextIssueDate?: string;

  @ApiPropertyOptional({ description: 'End date for the recurrence' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Template line items as JSON' })
  @IsOptional()
  @IsArray()
  lineItems?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Notes for generated invoices' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Payment terms for generated invoices' })
  @IsOptional()
  @IsString()
  terms?: string;
}
