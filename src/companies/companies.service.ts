/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto, accounting_firm_id: number) {
    const newCompany = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        accounting_firm_id: accounting_firm_id
      },
    });

    const paymentsToCreate = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
    const referenceMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const paymentData = {
      reference_month: referenceMonth,
      value: newCompany.accounting_fee,
      status: 'PENDENTE',
      due_date: new Date(referenceMonth.getFullYear(), referenceMonth.getMonth(), newCompany.billing_due_day),
      company_id: newCompany.id,
    };
    paymentsToCreate.push(paymentData);
    }

    if (paymentsToCreate.length > 0) {
      await this.prisma.payment.createMany({
        data: paymentsToCreate,
    });
    }
  
    return newCompany;
  }

  async get(accounting_firm_id: number) {
    return this.prisma.company.findMany({
      where: {
        accounting_firm_id: accounting_firm_id,
        is_active: true,
      },
    });
  }

  async getOne(id: number, accounting_firm_id: number) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: id,
        is_active: true,
        accounting_firm_id: accounting_firm_id,
      },
    });
    if (!company) { throw new NotFoundException(`Company ${id} not found`); }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, accounting_firm_id: number) {
    await this.getOne(id, accounting_firm_id)

    return this.prisma.company.update({
      where: {
        id,
      },
      data: updateCompanyDto,
    });
  }

  async delete(id: number, accounting_firm_id: number): Promise<void> {
    await this.getOne(id, accounting_firm_id); 
  
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    await this.prisma.payment.deleteMany({
      where: {
        company_id: id,
        status: 'PENDENTE',
        reference_month: { gte: firstDayOfCurrentMonth },
      },
    });
  
    await this.prisma.company.update({
      where: { id },
      data: { is_active: false },
    });
  }
}