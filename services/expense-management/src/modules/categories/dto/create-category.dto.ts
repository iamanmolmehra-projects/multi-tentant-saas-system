import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Travel' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'TRAVEL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ example: 'All travel-related expenses' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-of-parent-category' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
