import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Flight to Mumbai' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Round trip flight for client meeting' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4500.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  expenseDate: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-report' })
  @IsOptional()
  @IsUUID()
  reportId?: string;

  @ApiPropertyOptional({ example: 'IndiGo Airlines' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  merchantName?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/receipts/abc.pdf' })
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional({ example: { fileSize: 1024, mimeType: 'application/pdf' } })
  @IsOptional()
  receiptMetadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: 'req_abc123',
    description: 'Client-generated idempotency key to prevent duplicate submissions',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  idempotencyKey?: string;
}
