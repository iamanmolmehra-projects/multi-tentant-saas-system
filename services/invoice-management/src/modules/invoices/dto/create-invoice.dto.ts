import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateLineItemDto {
  @ApiProperty({ description: 'Line item description' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ description: 'Quantity', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Tax rate percentage', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Discount rate percentage', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number;

  @ApiPropertyOptional({ description: 'HSN/SAC code for tax classification' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  hsnCode?: string;

  @ApiPropertyOptional({ description: 'Sort order for display' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ description: 'Invoice issue date' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ description: 'Invoice due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Exchange rate', default: 1 })
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

  @ApiProperty({ description: 'Invoice line items', type: [CreateLineItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  lineItems: CreateLineItemDto[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
