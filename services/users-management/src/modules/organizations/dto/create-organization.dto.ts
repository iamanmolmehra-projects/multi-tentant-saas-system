import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'acme-corporation' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({ description: 'Parent org ID for hierarchy' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: Record<string, unknown>;
}
