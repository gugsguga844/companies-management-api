import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
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
activity?: string;
}