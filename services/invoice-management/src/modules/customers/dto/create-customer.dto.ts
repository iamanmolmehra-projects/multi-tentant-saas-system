import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Customer email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Customer phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Billing address object' })
  @IsOptional()
  @IsObject()
  billingAddress?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Shipping address object' })
  @IsOptional()
  @IsObject()
  shippingAddress?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Tax identification number (GST, VAT, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string;

  @ApiPropertyOptional({ description: 'Default currency for the customer', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}
