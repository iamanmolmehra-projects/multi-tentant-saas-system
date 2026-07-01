import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateCreditNoteDto {
  @ApiProperty({ description: 'Invoice ID this credit note is against' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ description: 'Credit amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ description: 'Reason for the credit note' })
  @IsOptional()
  @IsString()
  reason?: string;
}
