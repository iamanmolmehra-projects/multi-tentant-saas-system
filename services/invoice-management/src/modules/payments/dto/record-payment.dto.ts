import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty({ description: 'Invoice ID to record payment against' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Payment method (bank_transfer, upi, card, cash, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;

  @ApiProperty({ description: 'Date of payment' })
  @IsDateString()
  paymentDate: string;

  @ApiPropertyOptional({ description: 'Reference number from payment provider' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Payment gateway reference' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  gatewayRef?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Idempotency key to prevent duplicate payments. Must be unique per payment.',
  })
  @IsString()
  @MaxLength(64)
  idempotencyKey: string;
}
