import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Role ID to assign' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiPropertyOptional({ description: 'Parent user ID (reporting manager)' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
