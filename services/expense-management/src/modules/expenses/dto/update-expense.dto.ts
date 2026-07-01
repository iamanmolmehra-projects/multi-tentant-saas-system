import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateExpenseDto {
  @ApiPropertyOptional({ example: 'Updated flight expense' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 5000.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: '2024-01-16' })
  @IsOptional()
  @IsDateString()
  expenseDate?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-report' })
  @IsOptional()
  @IsUUID()
  reportId?: string;

  @ApiPropertyOptional({ example: 'Air India' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  merchantName?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/receipts/updated.pdf' })
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  receiptMetadata?: Record<string, unknown>;
}
