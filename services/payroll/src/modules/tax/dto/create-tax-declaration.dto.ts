import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTaxDeclarationDto {
  @ApiProperty({
    description: 'Financial year (e.g., 2024-25)',
    example: '2024-25',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Financial year must be in format YYYY-YY (e.g., 2024-25)' })
  financialYear: string;

  @ApiPropertyOptional({
    description: 'Tax regime selection',
    example: 'new',
    enum: ['new', 'old'],
    default: 'new',
  })
  @IsOptional()
  @IsString()
  @IsIn(['new', 'old'])
  regime?: string;

  @ApiProperty({
    description: 'Tax declarations/deductions',
    example: {
      section_80c: 150000,
      section_80d: 25000,
      hra_exemption: 120000,
      home_loan_interest: 200000,
      section_80ccd: 50000,
    },
  })
  @IsObject()
  declarations: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Declaration status',
    example: 'draft',
    enum: ['draft', 'submitted', 'verified'],
    default: 'draft',
  })
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'submitted', 'verified'])
  status?: string;
}
