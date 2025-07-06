import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;
}
