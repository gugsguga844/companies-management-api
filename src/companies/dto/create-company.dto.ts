import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsNumber,
    IsPositive,
    IsOptional,
    IsInt,
  } from 'class-validator';
  
  export class CreateCompanyDto {
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    name: string;
  
    @IsString()
    @IsOptional() // O nome fantasia é opcional
    trade_name?: string;
  
    @IsString({ message: 'O CNPJ deve ser uma string.' })
    @IsNotEmpty({ message: 'O CNPJ não pode ser vazio.' })
    cnpj: string;
  
    @IsString()
    @IsOptional()
    activity?: string;
  
    @IsNumber({}, { message: 'O valor dos honorários deve ser um número.' })
    @IsPositive({ message: 'O valor dos honorários deve ser um número positivo.' })
    accounting_fee: number;
  
    @IsEmail({}, { message: 'O email informado é inválido.' })
    @IsNotEmpty({ message: 'O email não pode ser vazio.' })
    email: string;

    @IsInt({ message: 'O dia de vencimento deve ser um número.' })
    @IsOptional()
    billing_due_day?: number;
  
    // Não precisamos receber o accounting_firm_id aqui.
    // Vamos obter essa informação do usuário que está logado (o token JWT).
    // Faremos isso na Sprint 3. Por enquanto, vamos "chumbar" esse valor no serviço.
  }