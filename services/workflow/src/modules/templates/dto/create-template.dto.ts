import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class StepConfigDto {
  @ApiProperty({ description: 'Step number in sequence' })
  @IsNotEmpty()
  stepNumber: number;

  @ApiProperty({ description: 'Type of approver resolution: hierarchy, role, specific_user' })
  @IsString()
  @IsNotEmpty()
  approverType: string;

  @ApiPropertyOptional({ description: 'Specific approver configuration value' })
  @IsOptional()
  @IsString()
  approverValue?: string;

  @ApiPropertyOptional({ description: 'Role to resolve approver' })
  @IsOptional()
  @IsString()
  approverRole?: string;

  @ApiPropertyOptional({ description: 'SLA hours for this step' })
  @IsOptional()
  slaHours?: number;
}

export class CreateTemplateDto {
  @ApiProperty({ description: 'Template name', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Trigger type (e.g., expense_report, leave_request)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  triggerType: string;

  @ApiProperty({ description: 'Steps configuration', type: [StepConfigDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepConfigDto)
  stepsConfig: StepConfigDto[];

  @ApiPropertyOptional({ description: 'Whether the template is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
