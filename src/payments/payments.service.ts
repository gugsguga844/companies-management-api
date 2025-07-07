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

    const companies = await this.prismaService.company.findMany({
        where: {
            accounting_firm_id: accountingFirmId,
            is_active: true,
        },
    });

    if (companies.length === 0) {
        throw new BadRequestException('Nenhuma empresa ativa encontrada para gerar faturas.');
    }

    const paymentCreationPromises = companies.map(async (company) => {
      const existingPayment = await this.prismaService.payment.findFirst({
          where: {
              company_id: company.id,
              reference_month: referenceMonthDate,
          },
      });

      if (!existingPayment) {
          return {
              reference_month: referenceMonthDate,
              value: company.accounting_fee,
              status: 'PENDENTE',
              due_date: new Date(referenceMonthDate.getFullYear(), referenceMonthDate.getMonth(), company.billing_due_day),
              company_id: company.id,
          };
      }
      return null;
    });

    const paymentsData = (await Promise.all(paymentCreationPromises))
      .filter(p => p !== null);

    if (paymentsData.length === 0) {
      return { message: 'Todas as faturas para este mês já foram geradas.' };
    }

    const result = await this.prismaService.payment.createMany({
      data: paymentsData,
    });

    return { message: `${result.count} faturas geradas com sucesso.` };
  }

  async findAll(accountingFirmId: number) {
    return this.prismaService.payment.findMany({
      where: {
        company: {
          accounting_firm_id: accountingFirmId,
        },
      },
      include: {
        company: {
          select: {
            name: true,
            is_active: true,
          },
        },
      },
      orderBy: {
        due_date: 'desc',
      },
    });
  }

  async getMonthlyRevenue(accountingFirmId: number, year?: number, month?: number) {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? (now.getMonth() + 1);

    const start = new Date(targetYear, targetMonth - 1, 1);
    const end = new Date(targetYear, targetMonth, 1);

    // Soma de todos os pagamentos do mês (independente do status)
    const total = await this.prismaService.payment.aggregate({
      _sum: { value: true },
      where: {
        reference_month: {
          gte: start,
          lt: end,
        },
        company: {
          accounting_firm_id: accountingFirmId,
        },
      },
    });

    return {
      month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
      total: total._sum.value ?? 0,
    };
  }

  async updatePayment(id: number, updatePaymentDto: import('./dto/update-payment.dto').UpdatePaymentDto) {
    return this.prismaService.payment.update({
      where: { id },
      data: updatePaymentDto,
    });
  }
}