import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Customer name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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

  @ApiPropertyOptional({ description: 'Default currency for the customer' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Whether the customer is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
