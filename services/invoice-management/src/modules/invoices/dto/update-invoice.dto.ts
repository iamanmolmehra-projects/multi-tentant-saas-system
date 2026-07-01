import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateLineItemDto } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @ApiPropertyOptional({ description: 'Invoice issue date' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ description: 'Invoice due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Exchange rate' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @ApiPropertyOptional({ description: 'Notes for the customer' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Payment terms' })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiPropertyOptional({ description: 'Updated line items (replaces existing)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  lineItems?: CreateLineItemDto[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
