import { 
  IsDateString, IsNotEmpty 
} from 'class-validator';

export class GeneratePaymentsDto {
  @IsDateString(
    {},
    { message: 'O mês de referência deve ser uma data válida no formato AAAA-MM-DD.' },
  )
  @IsNotEmpty({ message: 'O mês de referência não pode ser vazio.' })
  reference_month: string;
}