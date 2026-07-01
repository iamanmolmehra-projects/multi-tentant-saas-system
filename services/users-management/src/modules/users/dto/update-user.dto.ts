import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Role ID to assign' })
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiPropertyOptional({ description: 'Parent user ID (reporting manager)' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Expected version for optimistic locking' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  version: number;
}
