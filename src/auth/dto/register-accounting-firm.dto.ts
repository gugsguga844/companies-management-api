import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsEmail,
    IsPhoneNumber,
    MinLength,
} from 'class-validator';

export class RegisterAccountingFirmDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string;

    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    fantasy_name?: string;
}