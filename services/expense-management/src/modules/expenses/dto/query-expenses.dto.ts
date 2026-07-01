import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '@multi-tenant/shared';

export class QueryExpensesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'draft', description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-report' })
  @IsOptional()
  @IsUUID()
  reportId?: string;

  @ApiPropertyOptional({ example: '2024-01-01', description: 'Filter expenses from this date' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2024-01-31', description: 'Filter expenses up to this date' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
