import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    IsInt,
} from 'class-validator';

export class UpdateCompanyDto {
@IsOptional()
@IsString()
name?: string;

@IsOptional()
@IsString()
trade_name?: string;

@IsOptional()
cnpj?: string;

@IsOptional()
@IsEmail()
email?: string;

@IsOptional()
@IsNumber()
accounting_fee?: number;

@IsOptional()
@IsInt()
billing_due_day?: number;

@IsOptional()
activity?: string;
}