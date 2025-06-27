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
    return this.prisma.company.create({
      data: {
        ...createCompanyDto,
        accounting_firm_id: accounting_firm_id
      },
    });
  }

  async get() {
    return this.prisma.company.findMany();
  }

  async getOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.getOne(id)

    return this.prisma.company.update({
      where: {
        id,
      },
      data: updateCompanyDto,
    });
  }

  async delete(id: number) {
    await this.getOne(id)
    
    return this.prisma.company.delete({
      where: {
        id,
      }
    });
  }
}