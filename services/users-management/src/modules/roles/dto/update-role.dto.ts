import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Finance Manager' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Permission IDs to assign', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissionIds?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
