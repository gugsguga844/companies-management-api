import {
    IsEmail,
    IsNotEmpty,
} from 'class-validator';

export class LoginAccountingFirmDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}