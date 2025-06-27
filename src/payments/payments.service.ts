/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { GeneratePaymentsDto } from './dto/generate-payments.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private readonly prismaService: PrismaService) {}

    async generatePayments(
        accountingFirmId: number,
        generatePaymentsDto: GeneratePaymentsDto,
    ) {
        const { reference_month } = generatePaymentsDto;
        const referenceMonthDate = new Date(reference_month);

        // Passo 1: Buscar todas as empresas ativas do escritório logado.
        const companies = await this.prismaService.company.findMany({
            where: {
                accounting_firm_id: accountingFirmId,
            },
        });

        if (companies.length === 0) {
            throw new BadRequestException('Nenhuma empresa encontrada.');
        }

        // Passo 2: Para cada empresa, vamos preparar os dados do pagamento.
        const paymentCreationPromises = companies.map(async (company) => {
            // Passo 3 (Dentro do Loop): Verificar se já existe um pagamento para esta empresa/mês.
            const existingPayment = await this.prismaService.payment.findFirst({
                where: {
                    company_id: company.id,
                    reference_month: referenceMonthDate,
                },
            });

            // Se o pagamento NÃO existir, preparamos os dados para a criação.
            if (!existingPayment) {
                return {
                    reference_month: referenceMonthDate,
                    value: company.accounting_fee, // Pega a taxa da empresa!
                    status: 'PENDENTE',
                    // Lógica simples para o vencimento (ex: dia 10 do mesmo mês)
                    due_date: new Date(referenceMonthDate.getFullYear(), referenceMonthDate.getMonth(), company.billing_due_day),
                    company_id: company.id,
                };
            }
            return null; // Retorna nulo se o pagamento já existir
        });

        // Espera todas as verificações terminarem
        const paymentsData = (await Promise.all(paymentCreationPromises))
            .filter(p => p !== null); // Filtra os que já existiam

        // Passo 4: Se não houver nenhuma nova fatura para criar, informa o usuário.
        if (paymentsData.length === 0) {
            return { message: 'Todas as faturas para este mês já foram geradas.' };
        }

        // Passo 5: Usa o createMany com o ARRAY de dados que preparamos.
        const result = await this.prismaService.payment.createMany({
            data: paymentsData,
        });

        // Retorna a contagem de faturas que foram realmente criadas.
        return { message: `${result.count} faturas geradas com sucesso.` };
    }
}