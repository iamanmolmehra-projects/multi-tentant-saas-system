import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateInstanceDto {
  @ApiProperty({ description: 'Entity type that triggers the workflow (e.g., expense_report)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  triggerEntityType: string;

  @ApiProperty({ description: 'UUID of the entity that triggers the workflow' })
  @IsUUID()
  @IsNotEmpty()
  triggerEntityId: string;

  @ApiPropertyOptional({ description: 'Additional metadata for the workflow instance' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
