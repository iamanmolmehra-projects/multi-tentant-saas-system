import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corp Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  settings?: Record<string, unknown>;
}
