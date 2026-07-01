import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Finance Manager' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Can manage finance operations' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Permission IDs to assign', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
