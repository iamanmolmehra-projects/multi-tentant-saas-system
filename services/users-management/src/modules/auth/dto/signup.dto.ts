import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ss1' })
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

  @ApiProperty({ description: 'Organization ID the user belongs to' })
  @IsUUID()
  @IsNotEmpty()
  orgId: string;

  @ApiPropertyOptional({ description: 'Specific role ID (defaults to employee)' })
  @IsUUID()
  @IsOptional()
  roleId?: string;
}
